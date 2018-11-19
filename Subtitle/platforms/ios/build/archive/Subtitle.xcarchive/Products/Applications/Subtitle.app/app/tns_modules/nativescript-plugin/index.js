module.exports = {
  echo: function(phrase) {
      console.log(phrase);
  },
  getDate: function() {
    var dateFormatter = NSDateFormatter.alloc().init();
    var locale = NSLocale.localeWithLocaleIdentifier("en_US_POSIX");
    var now = NSDate.date();

    dateFormatter.locale = locale;
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ";

    return dateFormatter.stringFromDate(now);
  }
}