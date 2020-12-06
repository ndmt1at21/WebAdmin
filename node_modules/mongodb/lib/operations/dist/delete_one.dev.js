'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var OperationBase = require('./operation').OperationBase;

var deleteCallback = require('./common_functions').deleteCallback;

var removeDocuments = require('./common_functions').removeDocuments;

var DeleteOneOperation =
/*#__PURE__*/
function (_OperationBase) {
  _inherits(DeleteOneOperation, _OperationBase);

  function DeleteOneOperation(collection, filter, options) {
    var _this;

    _classCallCheck(this, DeleteOneOperation);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DeleteOneOperation).call(this, options));
    _this.collection = collection;
    _this.filter = filter;
    return _this;
  }

  _createClass(DeleteOneOperation, [{
    key: "execute",
    value: function execute(callback) {
      var coll = this.collection;
      var filter = this.filter;
      var options = this.options;
      options.single = true;
      removeDocuments(coll, filter, options, function (err, r) {
        return deleteCallback(err, r, callback);
      });
    }
  }]);

  return DeleteOneOperation;
}(OperationBase);

module.exports = DeleteOneOperation;