

module.exports = {

  calculateMilliseconds: function(num, type){

    switch (type) {
      case 'seconds':
          return (num * 1000);
        break;
      case 'minutes':
        return (num * 60 * 1000);
        break;
      case 'hours':
        return (num * 60 * 60 * 1000);
        break;
    }

  }

}
