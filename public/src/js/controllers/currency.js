'use strict';

angular.module('insight.currency').controller('CurrencyController',
  function($scope, $rootScope, Currency) {
    $rootScope.currency.symbol = defaultCurrency;

    var _roundFloat = function(x, n) {
      if(!parseInt(n, 10) || !parseFloat(x)) n = 0;

      return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    };

    $rootScope.currency.getConvertion = function(value) {
      value = value * 1; // Convert to number

      if (!isNaN(value) && typeof value !== 'undefined' && value !== null) {
        if (value === 0.00000000) return '0 ' + this.symbol; // fix value to show

        var response;

        if (this.symbol === 'BTC') {
          response = _roundFloat((value * this.factor), 8);
          
        } else if (this.symbol === 'NLG') {
          this.factor = 1;
          response = _roundFloat((value * this.factor), 8);
          
        } else if (this.symbol === 'mNLG') {
          this.factor = 1000;
          response = _roundFloat((value * this.factor), 5);
        } else if (this.symbol === 'uNLG') {
          this.factor = 1000000;
          response = _roundFloat((value * this.factor), 2);
        } else {
          this.factor = 1;
          response = value;
        }
        // prevent sci notation
        if (response < 1e-7) response=response.toFixed(8);

        return response + ' ' + this.symbol;
      }

      return 'value error';
    };

    $scope.setCurrency = function(currency) {
      $rootScope.currency.symbol = currency;
      localStorage.setItem('insight-currency', currency);

      if (currency === 'BTC') {
        Currency.get({}, function(res) {
          $rootScope.currency.factor = $rootScope.currency.nlgbtc = res.data.nlgbtc;
        });
      } else if (currency === 'NLG') {
        $rootScope.currency.factor = 1;
      } else if (currency === 'mNLG') {
        $rootScope.currency.factor = 1000;
      } else if (currency === 'uNLG') {
        $rootScope.currency.factor = 1000000;
      } else {
        $rootScope.currency.factor = 1;
      }
    };

    // Get initial value
    Currency.get({}, function(res) {
      $rootScope.currency.factor = $rootScope.currency.nlgbtc = res.data.nlgbtc;
    });

  });
