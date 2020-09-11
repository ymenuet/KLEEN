const moment =  require("moment")

module.exports = {
    modifyDate:(date,format) => moment(date).format(format)
}