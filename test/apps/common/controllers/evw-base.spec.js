'use strict';

const proxyquire = require('proxyquire');
const BaseController = require('hof').controllers.base;
const ErrorController = require('hof').controllers.error;

describe('apps/common/controllers/evw-base', function() {
  let EvwBaseController;
  let controller;
  let mockFormatting;
  const dateKeys = ['my-date-key1', 'my-date-key2'];
  const timeKeys = ['my-time-key'];

  beforeEach(function() {
    mockFormatting = {
      getDate: sinon.stub(),
      getFormattedDate: sinon.stub(),
      getTime: sinon.stub(),
      getFormattedTime: sinon.stub()
    };
    EvwBaseController = proxyquire('../../../../apps/common/controllers/evw-base', {
      '../../../lib/formatting': mockFormatting
    });
    controller = new EvwBaseController({
      template: 'some-template',
      options: {
        dateKeys: dateKeys,
        timeKeys: timeKeys
      }
    });
  });

  describe('#constructor', function() {
    it('sets date, time and overridable typeahead keys', function() {
      controller.should.have.property('dateKeys');
      controller.should.have.property('timeKeys');
      controller.dateKeys.should.deep.equal(dateKeys);
      controller.timeKeys.should.deep.equal(timeKeys);
    });
  });

  describe('#process', function() {
    let req;
    let res;
    let callback;
    let formValues;
    let superProcessStub;

    beforeEach(function() {
      superProcessStub = sinon.stub(BaseController.prototype, 'process');
      formValues = {
        'my-date-key1': '',
        'my-date-key1-day': '01',
        'my-date-key1-month': '02',
        'my-date-key1-year': '2010',
        'my-date-key2': '',
        'my-date-key2-day': '15',
        'my-date-key2-month': '12',
        'my-date-key2-year': '2015',
        'my-time-key': '',
        'my-time-key-hours': '12',
        'my-time-key-minutes': '30'
      };
      req = {
        form: {
          values: formValues
        }
      };
      res = {};
      callback = sinon.spy();
    });

    afterEach(function() {
      superProcessStub.restore();
    });

    it('sets main date and formatted date field for each dateKey', function() {
      mockFormatting.getDate.withArgs(formValues, 'my-date-key1').returns('2010-02-01');
      mockFormatting.getDate.withArgs(formValues, 'my-date-key2').returns('2015-12-15');
      mockFormatting.getFormattedDate.withArgs('2010-02-01').returns('01/02/2010');
      mockFormatting.getFormattedDate.withArgs('2015-12-15').returns('15/12/2015');
      controller.process(req, res, callback);
      mockFormatting.getDate.should.have.been.calledTwice;
      mockFormatting.getFormattedDate.should.have.been.calledTwice;
      mockFormatting.getDate.should.have.been.calledWith(formValues, 'my-date-key1');
      mockFormatting.getDate.should.have.been.calledWith(formValues, 'my-date-key2');
      mockFormatting.getFormattedDate.should.have.been.calledWith('2010-02-01');
      mockFormatting.getFormattedDate.should.have.been.calledWith('2015-12-15');
      formValues['my-date-key1'].should.equal('2010-02-01');
      formValues['my-date-key2'].should.equal('2015-12-15');
      formValues['my-date-key1-formatted'].should.equal('01/02/2010');
      formValues['my-date-key2-formatted'].should.equal('15/12/2015');
    });

    it('sets main time field for each timeKey, using formatting library', function() {
      mockFormatting.getTime.withArgs(formValues, 'my-time-key').returns('12:30');
      mockFormatting.getFormattedTime.withArgs('12:30').returns('12:30');
      controller.process(req, res, callback);
      mockFormatting.getTime.should.have.been.calledOnce;
      mockFormatting.getFormattedTime.should.have.been.calledOnce;
      mockFormatting.getTime.should.have.been.calledWith(formValues, 'my-time-key');
      mockFormatting.getFormattedTime.should.have.been.calledWith('12:30');
      formValues['my-time-key'].should.equal('12:30');
    });

    it('calls the parent process function', function() {
      controller.process(req, res, callback);
      superProcessStub.should.have.been.calledWith(req, res, callback);
    });
  });

  describe('#validateField', function () {
    let key = 'lifetime-expiry';
    let validatorTypeStub = sinon.stub();
    let secondValidator = sinon.stub();
    let seshStub = sinon.stub();
    let req = {
      sessionModel: seshStub,
      fields: {
        'lifetime-expiry': {
          validators: [{
            type: validatorTypeStub,
            arguments: 100
          }, {
            type: secondValidator
          }]
        }
      },
      form: {
        values: {
          'lifetime-expiry': 88
        }
      }
    };

    beforeEach(function() {
      BaseController.prototype.validateField = sinon.stub();
    });

    afterEach(function() {
      BaseController.prototype.validateField.reset();
    });

    it('calls parent validateField', function () {
      controller.validateField(key, req);
      BaseController.prototype.validateField.should.have.been.called;
    });

    describe('with custom validators', function () {
      it('calls custom validator', function () {
        controller.validateField(key, req);
        validatorTypeStub.should.have.been.calledWith(88, 100);
      });

      describe('☑️ valid field ☑️', function () {
        beforeEach(function () {
          validatorTypeStub.returns(false);
        });
        it('returns undefined', function () {
          let res = controller.validateField(key, req);
          should.not.exist(res);
        });
      });
      describe('🙅 does not validate 🙅', function () {
        beforeEach(function () {
          validatorTypeStub.returns(true);
        });
        it('calls error controller', function () {
          controller.validateField(key, req)
          .should.be.an.instanceOf(ErrorController);
        });
      });
      describe(`first validator yes 😀
        second validator no 😭`, function () {
        beforeEach(function () {
          validatorTypeStub.returns(false);
          secondValidator.returns(true);
        });
        it('calls error controller', function () {
          controller.validateField(key, req)
          .should.be.an.instanceOf(ErrorController);
        });
      });
    });
  });

});
