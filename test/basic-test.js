/* jshint expr: true */
/* globals typeAhead */
describe('<paper-autocomplete>', function() {
  
  function valueSupplier(value, callBack) {
    return callBack(typeAhead);
  }

  describe('<paper-autocomplete> defaults', function() {
    var tH1;

    before(function() {
      tH1 = fixture('tH1');
      tH1.supplier = valueSupplier;
    });
    
    it('defines "_changeTimeOut" property', function() {
      expect(tH1.properties).to.include.keys('_changeTimeOut');
    });

    it('defines "_closeTimeout" property', function() {
      expect(tH1.properties).to.include.keys('_closeTimeout');
    });

    it('defines "_redrawFix" property', function() {
      expect(tH1.properties).to.include.keys('_redrawFix');
      expect(tH1._redrawFix).to.be.a('number');
    });

    it('defines "focused" property', function() {
      expect(tH1.properties).to.include.keys('focused');
    });

    it('defines "_suggestions" property', function() {
      expect(tH1._suggestions).to.be.an('array');
      expect(tH1._suggestions).to.have.length(0);
    });

    it('defines "_threshold" property', function() {
      expect(tH1.properties).to.include.keys('_threshold');
      expect(tH1._threshold).to.be.a('number');
    });

    it('defines "append" property', function() {
      expect(tH1.properties).to.include.keys('append');
      expect(tH1.append).to.be.a('boolean');
      expect(tH1.append).to.be.false;
    });

    it('defines "_closeDelay" property', function() {
      expect(tH1.properties).to.include.keys('_closeDelay');
      expect(tH1._closeDelay).to.be.a('number');
    });

    it('defines "supplier" property', function() {
      expect(tH1.properties).to.include.keys('supplier');
      expect(tH1.supplier).to.be.an('function');
    });

  });

  describe('<paper-autocomplete> item selection when append is false', function() {
    var tH2;

    beforeEach(function() {
      tH2 = fixture('tH1');
      tH2.supplier = valueSupplier;
    });

    it('should open dropdown on focus', function(done) {
      tH2.querySelector('paper-input').$.input.dispatchEvent(new CustomEvent('focus', {
        bubbles: true
      }));
      setTimeout(function() {
        expect(tH2.querySelector('iron-dropdown').opened).to.be.true;
        done();
      }, tH2._redrawFix * 2);
    });
    it('should select single value on item tap', function(done) {
      tH2.querySelector('paper-input').$.input.dispatchEvent(new CustomEvent('focus', {
        bubbles: true
      }));
      setTimeout(function() {
        tH2.querySelectorAll('paper-menu paper-item')[0].dispatchEvent(new CustomEvent('tap', {
          bubbles: true
        }));
        expect(tH2.value).to.not.be.undefined;
        done();
      }, tH2._redrawFix * 2);
    });
  });

  describe('<paper-autocomplete> item selection when append is true', function() {
    var tH3;

    before(function() {
      tH3 = fixture('tH2');
      tH3.supplier = valueSupplier;
    });

    it('should select single value on item tap', function(done) {
      tH3.querySelector('paper-input').$.input.dispatchEvent(new CustomEvent('focus', {
        bubbles: true
      }));
      setTimeout(function() {
        tH3.querySelectorAll('paper-menu paper-item')[0].dispatchEvent(new CustomEvent('tap', {
          bubbles: true
        }));
        tH3.querySelectorAll('paper-menu paper-item')[1].dispatchEvent(new CustomEvent('tap', {
          bubbles: true
        }));
        expect(tH3.value).to.not.be.undefined;
        done();
      }, tH3._redrawFix * 2);
    });
  });
});
/* jshint expr: false */
