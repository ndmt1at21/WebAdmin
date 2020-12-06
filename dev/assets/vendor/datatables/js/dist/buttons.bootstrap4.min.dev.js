"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 Bootstrap integration for DataTables' Buttons
 ©2016 SpryMedia Ltd - datatables.net/license
*/
(function (c) {
  "function" === typeof define && define.amd ? define(["jquery", "datatables.net-bs4", "datatables.net-buttons"], function (a) {
    return c(a, window, document);
  }) : "object" === (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? module.exports = function (a, b) {
    a || (a = window);
    if (!b || !b.fn.dataTable) b = require("datatables.net-bs4")(a, b).$;
    b.fn.dataTable.Buttons || require("datatables.net-buttons")(a, b);
    return c(b, a, a.document);
  } : c(jQuery, window, document);
})(function (c) {
  var a = c.fn.dataTable;
  c.extend(!0, a.Buttons.defaults, {
    dom: {
      container: {
        className: "dt-buttons"
      },
      button: {
        className: "btn btn-outline-light"
      },
      collection: {
        tag: "div",
        className: "dt-button-collection dropdown-menu",
        button: {
          tag: "a",
          className: "dt-button dropdown-item",
          active: "active",
          disabled: "disabled"
        }
      }
    }
  });
  a.ext.buttons.collection.className += " dropdown-toggle";
  return a.Buttons;
});