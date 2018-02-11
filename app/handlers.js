const msgs = require('./messages');
const dateHelper = require('./helpers/date');
const buildings = require('./buildings.json');

module.exports = function(ctx) {
  const { rings, detectGroup, schedule } = require('./schedule')(ctx);

  const module = {};

  const { bot, redis, logger } = ctx;

  module.rings = function(msg, match) {
    rings().then(times => {
      bot.sendMessage(msg.chat.id, `Звонки:\n${times.join("\n")}`);
    }).catch(err => {
      logger.error(err);
      bot.sendMessage(msg.chat.id, msgs.error);
    });
  };

  module.memorizeGroup = function(msg, match) {
    const groupName = match[2];

    if (!groupName) {
      bot.sendMessage(msg.chat.id, msgs.group.forgotName);
      return;
    }

    detectGroup(groupName)
      .then(groups => {
        if (groups.length == 0) {
          bot.sendMessage(msg.chat.id, msgs.group.notFound);
        } else if (groups.length > 1) {
          bot.sendMessage(msg.chat.id, `Список похожих групп:\n${groups.map(g => g.name).join("\n")}`);
        } else {
          redis.set(msg.from.id, groups[0].id);
          bot.sendMessage(msg.chat.id, `Я запомнил, что вы учитесь в группе *${groups[0].name}* ;)`, { parse_mode: 'Markdown' });
        }
      })
      .catch(err => {
        logger.error(err);
        bot.sendMessage(msg.chat.id, msgs.error);
      });
  };

  module.link = function(msg, match) {
    redis.getAsync(msg.from.id).then(groupId => {
      if (!groupId) throw 'Group id not found';
      bot.sendMessage(msg.chat.id, `https://vyatsuschedule.herokuapp.com/mobile/${groupId}/${process.env.SEASON}`);
    }).catch(err => {
      logger.error(err);
      bot.sendMessage(msg.chat.id, msgs.forgotStudent);
    });
  };

  module.schedule = function(msg, date, nextDay) {
    date = date || new Date();
    redis.getAsync(msg.from.id)
      .then(groupId => {
        if (!groupId) throw 'Group id not found';
        return Promise.all([rings(true), schedule(groupId, date, nextDay)]);
      })
      .then(values => {
        const rings = values[0];
        const schedule = values[1];
        const answer = [];
        rings.forEach((v, i) => {
          if (schedule.day[i]) {
            answer.push(`*${v} >* ${schedule.day[i]}`);
          }
        });
        const keyboard = { 
          inline_keyboard: [
            [
              { 
                text: 'Next',
                callback_data: JSON.stringify({ t: 'n', d: schedule.date.toDateString(), gid: schedule.groupId })
              }
            ]
          ]
        };
        bot.sendMessage(
          msg.chat.id,
          `Расписание (${schedule.date.toLocaleDateString()}, ${dateHelper.dayName(schedule.date)}):\n${answer.join("\n")}`,
          { reply_markup: keyboard, parse_mode: 'Markdown' }
        );
      })
      .catch(err => {
        logger.error(err);
        bot.sendMessage(msg.chat.id, msgs.forgotStudent);
      });
  };

  module.locations = function(msg, match) {
    const buildingNumber = parseInt(match[2]) - 1;
    const building = buildings[buildingNumber];
    if (building) {
      bot.sendMessage(msg.chat.id, building.address).then(() => {
        bot.sendLocation(msg.chat.id, building.latitude, building.longitude);
      });
    } else {
      bot.sendMessage(msg.chat.id, 'Не знаю про что вы, но вот первый корпус').then(() => {
        bot.sendLocation(msg.chat.id, buildings[0].latitude, buildings[0].longitude);
      });
    }
  };

  return module;
};
