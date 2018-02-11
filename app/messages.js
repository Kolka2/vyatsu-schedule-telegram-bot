module.exports = {
  help:
`<b>Чат бот ВятГУ для просмотра расписания студентов.</b>
Команды (палка "|" означает ИЛИ):
<b>1.</b> /r | з(вонки) - расписание звонков
<b>2.</b> /w | н(еделя) - номер текущей недели
<b>3.</b> (g | г(руппа)) имя_группы - бот запомнит, в какой вы группе (можно вводить не полностью, предложит варианты)
<b>4.</b> /s | р(асписание) - расписание на текущий день (работает, если бот знает группу)
<b>5.</b> /u | с(сылка) - ссылка на полное расписание группы
<b>6.</b> (/where | где) номер_корпуса - адрес и корпус на карте (пример: <code>где 1 корпус</code> или просто <code>где 1</code>)
<b>Кто ни чего не понял, вот пошаговый пример:</b>
1) Сообщаем боту свою группу, чтобы он знал, какое расписание вам выдавать, для этого пишем:
<code>группа ивтб3302</code> - <i>Например, я учусь в ИВТб-3302-02-00. Заглавными или строчными, со знаками тире или без, неважно. Можно даже не полностью шифр группы писать, а только начало.</i>
2) Если группа найдена, то бот сообщит, что запомнил в какой группе вы учитесь, иначе выведет список похожих групп (в этом случае, найдите свою группу и введите ее со словом группа вначале).
3) После того, как бот запомнил вас, просим его показать расписание:
<code>\s</code> или <code>р</code> или <code>расписание</code> - <i>пишите как удобно вам, но одну букву ввести проще. Бот ответит сообщением, в котором будет расписание на текущий учебный день, если сегодня ВС, то покажет на ПН след. недели.</i>
<a href="https://vk.com/volodyaglyxix">Вопросы и пожелания</a>`,

  error: 'Ууупс... Какая-то ошибка :(',

  desc: 'Чат бот ВятГУ для просмотра расписания студентов. Для справки введите /help.',

  group: {
    notFound: 'Подходящих групп не найдено. Возможно Вы вводите группу с ошибкой, пример: ИВТб-3302-02-00 (без учета регистра)',
    forgotName: 'Забыли добавить имя группы :)'
  },

  forgotStudent: "К сожалению, я очень забывчивый бот. Либо Вы впервые здесь, либо я Вас забыл. Укажите группу, например:\n группа ивтб-3302"
};