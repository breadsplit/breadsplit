(function(e, a) { for(var i in a) e[i] = a[i]; }(this, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../node_modules/ts-optchain/dist/proxy/index.js":
/*!*************************************************************************!*\
  !*** C:/GitHub/breadsplit/node_modules/ts-optchain/dist/proxy/index.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Copyright (C) 2019-present, Rimeto, LLC.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * Proxy based implementation of optional chaining w/ default values.\n */\nfunction oc(data) {\n    return new Proxy((function (defaultValue) { return (data == null ? defaultValue : data); }), {\n        get: function (target, key) {\n            var obj = target();\n            return oc(typeof obj === 'object' ? obj[key] : undefined);\n        },\n    });\n}\nexports.oc = oc;\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/node_modules/ts-optchain/dist/proxy/index.js?");

/***/ }),

/***/ "../../core/activities_parser.ts":
/*!***************************************************************!*\
  !*** C:/GitHub/breadsplit/packages/core/activities_parser.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction getActivityDescription(t, act, locale, getUserName, serverSide = false) {\r\n    const $t = (key, args) => t(key, locale, args).toString();\r\n    let name;\r\n    if (typeof getUserName === 'string')\r\n        name = getUserName;\r\n    else if (getUserName != null)\r\n        name = getUserName(act.by);\r\n    const key = `${act.action}.${act.entity}`;\r\n    const key_field = `${act.action}.${act.entity}.${act.update_fields}`;\r\n    let by = name;\r\n    let entity_name = act.entity_name || act.entity_desc || '';\r\n    if (!serverSide) {\r\n        by = `<b>${by}</b>`;\r\n        entity_name = `<b>${entity_name}</b>`;\r\n    }\r\n    switch (key_field) {\r\n        case 'update.group.name':\r\n            return $t('acts.rename_group', [by, entity_name]);\r\n        case 'update.group.currency':\r\n            return $t('acts.change_group_currency', [by, entity_name]);\r\n    }\r\n    switch (key) {\r\n        case 'insert.transaction':\r\n            return $t('acts.insert_transaction', [by, entity_name]);\r\n        case 'remove.transaction':\r\n            return $t('acts.remove_transaction', [by, entity_name]);\r\n        case 'update.transaction':\r\n            return $t('acts.update_transaction', [by, entity_name]);\r\n        case 'insert.group':\r\n            return $t('acts.insert_group', [by]);\r\n        case 'publish.group':\r\n            return $t('acts.publish_group', [by]);\r\n        case 'insert.viewer':\r\n            return $t('acts.insert_viewer', [by]);\r\n        case 'insert.member':\r\n            return $t('acts.insert_member', [by, entity_name]);\r\n    }\r\n    return key;\r\n}\r\nexports.getActivityDescription = getActivityDescription;\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/core/activities_parser.ts?");

/***/ }),

/***/ "../../core/balance.ts":
/*!*****************************************************!*\
  !*** C:/GitHub/breadsplit/packages/core/balance.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst sumBy_1 = __importDefault(__webpack_require__(/*! lodash/sumBy */ \"lodash/sumBy\"));\r\nconst merge_1 = __importDefault(__webpack_require__(/*! lodash/merge */ \"lodash/merge\"));\r\nconst find_1 = __importDefault(__webpack_require__(/*! lodash/find */ \"lodash/find\"));\r\nconst map_1 = __importDefault(__webpack_require__(/*! lodash/map */ \"lodash/map\"));\r\nconst uniq_1 = __importDefault(__webpack_require__(/*! lodash/uniq */ \"lodash/uniq\"));\r\nconst concat_1 = __importDefault(__webpack_require__(/*! lodash/concat */ \"lodash/concat\"));\r\nconst fraction_js_1 = __importDefault(__webpack_require__(/*! fraction.js */ \"fraction.js\"));\r\nconst defaults_1 = __webpack_require__(/*! ./defaults */ \"../../core/defaults.ts\");\r\nconst _1 = __webpack_require__(/*! . */ \"../../core/index.ts\");\r\nfunction GCD(arr) {\r\n    // Use spread syntax to get minimum of array\r\n    const lowest = Math.min(...arr);\r\n    for (let factor = lowest; factor > 1; factor--) {\r\n        let isCommonDivisor = true;\r\n        for (let j = 0; j < arr.length; j++) {\r\n            if (arr[j] % factor !== 0) {\r\n                isCommonDivisor = false;\r\n                break;\r\n            }\r\n        }\r\n        if (isCommonDivisor)\r\n            return factor;\r\n    }\r\n    return 1;\r\n}\r\nexports.GCD = GCD;\r\nfunction CreditorWeights(trans) {\r\n    return sumBy_1.default(trans.creditors, c => c.weight || 0);\r\n}\r\nexports.CreditorWeights = CreditorWeights;\r\nfunction DebtorWeights(trans) {\r\n    return sumBy_1.default(trans.debtors, d => d.weight || 0);\r\n}\r\nexports.DebtorWeights = DebtorWeights;\r\nfunction TransactionBalanceChanges(trans) {\r\n    const fee = trans.total_fee;\r\n    const creditorWeights = CreditorWeights(trans);\r\n    const debtorWeights = DebtorWeights(trans);\r\n    const involvedIds = uniq_1.default(concat_1.default(map_1.default(trans.creditors, 'uid'), map_1.default(trans.debtors, 'uid')));\r\n    const changes = involvedIds.map((uid) => {\r\n        const credit_weight = merge_1.default({ weight: 0 }, find_1.default(trans.creditors, { uid })).weight;\r\n        const debt_weight = merge_1.default({ weight: 0 }, find_1.default(trans.debtors, { uid })).weight;\r\n        const credit = new fraction_js_1.default(fee).mul(credit_weight).div(creditorWeights);\r\n        const debt = new fraction_js_1.default(fee).mul(debt_weight).div(debtorWeights);\r\n        const balance = credit.sub(debt);\r\n        return {\r\n            uid,\r\n            credit_weight,\r\n            debt_weight,\r\n            credit,\r\n            debt,\r\n            balance,\r\n        };\r\n    });\r\n    return changes;\r\n}\r\nexports.TransactionBalanceChanges = TransactionBalanceChanges;\r\nfunction GroupCurrency(group) {\r\n    const set = new Set([group.main_currency]);\r\n    for (const trans of group.transactions)\r\n        set.add(trans.currency);\r\n    return Array.from(set);\r\n}\r\nexports.GroupCurrency = GroupCurrency;\r\nfunction getExchangeRateOn(from, to, exchange_record) {\r\n    const rate = exchange_record.rates[to.toUpperCase()] / exchange_record.rates[from.toUpperCase()];\r\n    return { rate, date: exchange_record.date };\r\n}\r\nexports.getExchangeRateOn = getExchangeRateOn;\r\nfunction applyExchangeRate(from, to, exchange_record, value) {\r\n    const { rate } = getExchangeRateOn(from, to, exchange_record);\r\n    return value.mul(rate);\r\n}\r\nexports.applyExchangeRate = applyExchangeRate;\r\nfunction GroupBalances(group, display, exchange_record = _1.FallbackExchangeRate) {\r\n    const main_currency = group.main_currency || defaults_1.defaultCurrency;\r\n    const display_currency = display || main_currency;\r\n    // init\r\n    let balances = Object.values(group.members)\r\n        .map((m) => {\r\n        return {\r\n            uid: m.uid,\r\n            balance: new fraction_js_1.default(0),\r\n            currency: display_currency,\r\n            removed: m.removed,\r\n        };\r\n    });\r\n    group.transactions.forEach((t) => {\r\n        const currency = t.currency;\r\n        const changes = TransactionBalanceChanges(t);\r\n        changes.forEach((c) => {\r\n            const balance = find_1.default(balances, { uid: c.uid });\r\n            if (!balance)\r\n                throw new Error(`Member with id:\"${c.uid}\" is not found.`);\r\n            let value = c.balance;\r\n            if (currency !== display_currency) {\r\n                // use transaction defined exchange info if it's avaliable\r\n                let record = (t.exchanges || []).find(e => e.from === currency && e.to === display_currency);\r\n                if (record) {\r\n                    value = c.balance.mul(record.rate);\r\n                }\r\n                else {\r\n                    record = (t.exchanges || []).find(e => e.from === currency && e.to === main_currency);\r\n                    if (record)\r\n                        value = applyExchangeRate(main_currency, display_currency, exchange_record, c.balance.mul(record.rate));\r\n                    else\r\n                        value = applyExchangeRate(currency, display_currency, exchange_record, c.balance);\r\n                }\r\n            }\r\n            balance.balance = balance.balance.add(value);\r\n        });\r\n    });\r\n    // remove the \"Removed members\" when theire balance equal to 0\r\n    balances = balances.filter(b => !b.removed || !b.balance.equals(0));\r\n    // sort by the balance\r\n    balances.sort((a, b) => {\r\n        if (a.removed === b.removed)\r\n            return a.balance.compare(b.balance);\r\n        if (a.removed)\r\n            return 1;\r\n        return -1;\r\n    });\r\n    return balances;\r\n}\r\nexports.GroupBalances = GroupBalances;\r\nfunction GetSettleUpSolutions(balances, group) {\r\n    let remaining = balances.map(b => ({\r\n        uid: b.uid,\r\n        balance: b.balance,\r\n    }));\r\n    const currency = group.main_currency || defaults_1.defaultCurrency;\r\n    const solutions = [];\r\n    function sort() {\r\n        remaining = remaining\r\n            .filter(i => +i.balance.abs() > 0.001)\r\n            .sort((a, b) => +a.balance.sub(b.balance));\r\n    }\r\n    sort();\r\n    while (remaining.length > 1) {\r\n        const first = remaining[0];\r\n        const last = remaining[remaining.length - 1];\r\n        const amount = first.balance.abs() < last.balance.abs() ? first.balance.abs() : last.balance.abs();\r\n        solutions.push({\r\n            to: last.uid,\r\n            from: first.uid,\r\n            amount,\r\n            currency,\r\n        });\r\n        first.balance = first.balance.add(amount);\r\n        last.balance = last.balance.sub(amount);\r\n        sort();\r\n    }\r\n    return solutions;\r\n}\r\nexports.GetSettleUpSolutions = GetSettleUpSolutions;\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/core/balance.ts?");

/***/ }),

/***/ "../../core/dayjs_config.ts":
/*!**********************************************************!*\
  !*** C:/GitHub/breadsplit/packages/core/dayjs_config.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst dayjs_1 = __importDefault(__webpack_require__(/*! dayjs */ \"dayjs\"));\r\nconst relativeTime_1 = __importDefault(__webpack_require__(/*! dayjs/plugin/relativeTime */ \"dayjs/plugin/relativeTime\"));\r\nconst localizedFormat_1 = __importDefault(__webpack_require__(/*! dayjs/plugin/localizedFormat */ \"dayjs/plugin/localizedFormat\"));\r\n__webpack_require__(/*! dayjs/locale/en */ \"dayjs/locale/en\");\r\n__webpack_require__(/*! dayjs/locale/zh-tw */ \"dayjs/locale/zh-tw\");\r\n__webpack_require__(/*! dayjs/locale/zh-cn */ \"dayjs/locale/zh-cn\");\r\n__webpack_require__(/*! dayjs/locale/ja */ \"dayjs/locale/ja\");\r\n__webpack_require__(/*! dayjs/locale/fr */ \"dayjs/locale/fr\");\r\ndayjs_1.default.extend(relativeTime_1.default);\r\ndayjs_1.default.extend(localizedFormat_1.default);\r\nexports.default = dayjs_1.default;\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/core/dayjs_config.ts?");

/***/ }),

/***/ "../../core/defaults.ts":
/*!******************************************************!*\
  !*** C:/GitHub/breadsplit/packages/core/defaults.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst merge_1 = __importDefault(__webpack_require__(/*! lodash/merge */ \"lodash/merge\"));\r\nconst mapValues_1 = __importDefault(__webpack_require__(/*! lodash/mapValues */ \"lodash/mapValues\"));\r\nconst id_helper_1 = __webpack_require__(/*! ./id_helper */ \"../../core/id_helper.ts\");\r\nexports.defaultCurrency = 'USD';\r\nexports.MemberDefault = (overrides) => merge_1.default({\r\n    uid: id_helper_1.GenerateId.LocalMember(),\r\n    name: '',\r\n    role: 'collaborator',\r\n}, overrides);\r\nexports.GroupDefault = (overrides) => {\r\n    const group = merge_1.default({\r\n        id: id_helper_1.GenerateId.LocalGroup(),\r\n        name: '',\r\n        options: {\r\n            multiple_currencies: true,\r\n        },\r\n        timestamp: +new Date(),\r\n        budgets: [],\r\n        members: {},\r\n        currencies: [],\r\n        currency_records: [],\r\n        transactions: [],\r\n        activities: [],\r\n        online: false,\r\n    }, overrides);\r\n    if (Array.isArray(group.members)) {\r\n        const members = {};\r\n        group.members.forEach((m) => {\r\n            const member = exports.MemberDefault(m);\r\n            members[member.uid] = member;\r\n        });\r\n        group.members = members;\r\n    }\r\n    else {\r\n        group.members = mapValues_1.default(group.members, m => exports.MemberDefault(m));\r\n    }\r\n    return group;\r\n};\r\nexports.SharedGroupOptionsDefault = (overrides) => merge_1.default({\r\n    public: true,\r\n}, overrides);\r\nexports.ClientGroupDefault = (overrides) => {\r\n    const group = exports.GroupDefault(overrides);\r\n    return {\r\n        id: group.id,\r\n        base: group,\r\n        operations: [],\r\n        syncingOperations: [],\r\n        lastchanged: +new Date(),\r\n        options: exports.SharedGroupOptionsDefault(),\r\n    };\r\n};\r\nexports.TransactionDefault = (overrides) => merge_1.default({\r\n    id: id_helper_1.GenerateId.Transaction(),\r\n    timestamp: +new Date(),\r\n    creditors: [],\r\n    debtors: [],\r\n    currency: exports.defaultCurrency,\r\n    creator: '',\r\n    category: '',\r\n    total_fee: 0,\r\n    service_fee_rate: 0,\r\n    type: 'expenses',\r\n    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,\r\n}, overrides);\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/core/defaults.ts?");

/***/ }),

/***/ "../../core/fallback_exchange_rates.ts":
/*!*********************************************************************!*\
  !*** C:/GitHub/breadsplit/packages/core/fallback_exchange_rates.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n// This is a hard-coded exchange rate it case there is no networks accessable for clients\r\n// should be updated if it's too old (over a month)\r\nexports.FallbackExchangeRate = {\r\n    timestamp: 1560466266,\r\n    base: 'EUR',\r\n    date: '2019-06-13',\r\n    rates: {\r\n        AED: 4.142923,\r\n        AFN: 89.72322,\r\n        ALL: 121.935718,\r\n        AMD: 539.734861,\r\n        ANG: 2.114716,\r\n        AOA: 382.332301,\r\n        ARS: 49.079424,\r\n        AUD: 1.631082,\r\n        AWG: 2.007624,\r\n        AZN: 1.923057,\r\n        BAM: 1.954219,\r\n        BBD: 2.257506,\r\n        BDT: 95.398271,\r\n        BGN: 1.955968,\r\n        BHD: 0.425266,\r\n        BIF: 2098.982456,\r\n        BMD: 1.127879,\r\n        BND: 1.52343,\r\n        BOB: 7.802948,\r\n        BRL: 4.341542,\r\n        BSD: 1.129176,\r\n        BTC: 0.000137,\r\n        BTN: 78.549102,\r\n        BWP: 12.264535,\r\n        BYN: 2.334033,\r\n        BYR: 22106.424578,\r\n        BZD: 2.273354,\r\n        CAD: 1.503181,\r\n        CDF: 1872.279108,\r\n        CHF: 1.120883,\r\n        CLF: 0.028461,\r\n        CLP: 785.336391,\r\n        CNY: 7.80684,\r\n        COP: 3686.471874,\r\n        CRC: 661.783343,\r\n        CUC: 1.127879,\r\n        CUP: 29.888788,\r\n        CVE: 110.785915,\r\n        CZK: 25.558748,\r\n        DJF: 200.446203,\r\n        DKK: 7.468134,\r\n        DOP: 57.707908,\r\n        DZD: 134.511021,\r\n        EGP: 18.902754,\r\n        ERN: 16.918099,\r\n        ETB: 32.81555,\r\n        EUR: 1,\r\n        FJD: 2.429788,\r\n        FKP: 0.88832,\r\n        GBP: 0.889447,\r\n        GEL: 3.084737,\r\n        GGP: 0.88953,\r\n        GHS: 6.107454,\r\n        GIP: 0.888322,\r\n        GMD: 56.174565,\r\n        GNF: 10415.960351,\r\n        GTQ: 8.667406,\r\n        GYD: 235.963089,\r\n        HKD: 8.829489,\r\n        HNL: 27.847787,\r\n        HRK: 7.413653,\r\n        HTG: 104.257175,\r\n        HUF: 322.054507,\r\n        IDR: 16209.310246,\r\n        ILS: 4.061038,\r\n        IMP: 0.88953,\r\n        INR: 78.754136,\r\n        IQD: 1342.175778,\r\n        IRR: 47489.337001,\r\n        ISK: 141.503996,\r\n        JEP: 0.88953,\r\n        JMD: 147.189583,\r\n        JOD: 0.799693,\r\n        JPY: 122.233897,\r\n        KES: 114.532146,\r\n        KGS: 78.7785,\r\n        KHR: 4588.211139,\r\n        KMF: 492.46004,\r\n        KPW: 1015.156292,\r\n        KRW: 1333.242919,\r\n        KWD: 0.342695,\r\n        KYD: 0.939952,\r\n        KZT: 434.537779,\r\n        LAK: 9761.791063,\r\n        LBP: 1704.341433,\r\n        LKR: 199.194799,\r\n        LRD: 218.949435,\r\n        LSL: 16.759864,\r\n        LTL: 3.330333,\r\n        LVL: 0.682242,\r\n        LYD: 1.584481,\r\n        MAD: 10.863839,\r\n        MDL: 20.515551,\r\n        MGA: 4077.281693,\r\n        MKD: 61.524695,\r\n        MMK: 1721.811474,\r\n        MNT: 2999.453798,\r\n        MOP: 9.09403,\r\n        MRO: 402.653333,\r\n        MUR: 40.080286,\r\n        MVR: 17.425898,\r\n        MWK: 840.827979,\r\n        MXN: 21.641693,\r\n        MYR: 4.698775,\r\n        MZN: 70.063766,\r\n        NAD: 16.760274,\r\n        NGN: 406.036422,\r\n        NIO: 37.654206,\r\n        NOK: 9.788745,\r\n        NPR: 125.482146,\r\n        NZD: 1.719558,\r\n        OMR: 0.434222,\r\n        PAB: 1.129176,\r\n        PEN: 3.757535,\r\n        PGK: 3.814768,\r\n        PHP: 58.480637,\r\n        PKR: 171.014666,\r\n        PLN: 4.255036,\r\n        PYG: 7050.201113,\r\n        QAR: 4.106633,\r\n        RON: 4.719272,\r\n        RSD: 118.009653,\r\n        RUB: 72.822289,\r\n        RWF: 1020.730319,\r\n        SAR: 4.22994,\r\n        SBD: 9.280356,\r\n        SCR: 15.431077,\r\n        SDG: 50.879704,\r\n        SEK: 10.695657,\r\n        SGD: 1.541461,\r\n        SHP: 1.489815,\r\n        SLL: 10055.039634,\r\n        SOS: 658.681242,\r\n        SRD: 8.411766,\r\n        STD: 23742.525133,\r\n        SVC: 9.869165,\r\n        SYP: 580.857468,\r\n        SZL: 16.760294,\r\n        THB: 35.201181,\r\n        TJS: 10.635389,\r\n        TMT: 3.947576,\r\n        TND: 3.343038,\r\n        TOP: 2.583739,\r\n        TRY: 6.616474,\r\n        TTD: 7.657902,\r\n        TWD: 35.498853,\r\n        TZS: 2594.34387,\r\n        UAH: 29.843381,\r\n        UGX: 4223.73682,\r\n        USD: 1.127879,\r\n        UYU: 39.892967,\r\n        UZS: 9603.887796,\r\n        VEF: 11.264687,\r\n        VND: 26302.133733,\r\n        VUV: 130.725955,\r\n        WST: 2.991399,\r\n        XAF: 655.477657,\r\n        XAG: 0.075565,\r\n        XAU: 0.000839,\r\n        XCD: 3.048149,\r\n        XDR: 0.81478,\r\n        XOF: 653.569901,\r\n        XPF: 119.779203,\r\n        YER: 282.364505,\r\n        ZAR: 16.763101,\r\n        ZMK: 10152.264916,\r\n        ZMW: 14.768552,\r\n        ZWL: 363.577385,\r\n    },\r\n    provider: 'fixer',\r\n};\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/core/fallback_exchange_rates.ts?");

/***/ }),

/***/ "../../core/id_helper.ts":
/*!*******************************************************!*\
  !*** C:/GitHub/breadsplit/packages/core/id_helper.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst nanoid_1 = __importDefault(__webpack_require__(/*! nanoid */ \"nanoid\"));\r\nexports.GenerateId = {\r\n    LocalGroup: () => `L:${nanoid_1.default(10)}`,\r\n    OnlineGroup: () => `O:${nanoid_1.default(16)}`,\r\n    Transaction: () => `T:${nanoid_1.default(16)}`,\r\n    LocalMember: () => `M:${nanoid_1.default(10)}`,\r\n};\r\nexports.IdMe = 'me';\r\nexports.IsThisId = {\r\n    LocalMember: (id) => id && id.startsWith('M:'),\r\n    LocalGroup: (id) => id && id.startsWith('L:'),\r\n    OnlineGroup: (id) => id && id.startsWith('O:'),\r\n    Transaction: (id) => id && id.startsWith('T:'),\r\n    UID: (id) => id && !id.startsWith('M:') && id !== exports.IdMe,\r\n    Me: (id) => id === exports.IdMe,\r\n};\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/core/id_helper.ts?");

/***/ }),

/***/ "../../core/index.ts":
/*!***************************************************!*\
  !*** C:/GitHub/breadsplit/packages/core/index.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nfunction __export(m) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n__export(__webpack_require__(/*! ./balance */ \"../../core/balance.ts\"));\r\n__export(__webpack_require__(/*! ./transforms */ \"../../core/transforms.ts\"));\r\n__export(__webpack_require__(/*! ./defaults */ \"../../core/defaults.ts\"));\r\n__export(__webpack_require__(/*! ./activities_parser */ \"../../core/activities_parser.ts\"));\r\n__export(__webpack_require__(/*! ./id_helper */ \"../../core/id_helper.ts\"));\r\n__export(__webpack_require__(/*! ./operation_transformer */ \"../../core/operation_transformer.ts\"));\r\n__export(__webpack_require__(/*! ./transaction_helper */ \"../../core/transaction_helper.ts\"));\r\n__export(__webpack_require__(/*! ./fallback_exchange_rates */ \"../../core/fallback_exchange_rates.ts\"));\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/core/index.ts?");

/***/ }),

/***/ "../../core/operation_transformer.ts":
/*!*******************************************************************!*\
  !*** C:/GitHub/breadsplit/packages/core/operation_transformer.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst cloneDeep_1 = __importDefault(__webpack_require__(/*! lodash/cloneDeep */ \"lodash/cloneDeep\"));\r\n// @ts-ignore\r\nconst rusha_1 = __importDefault(__webpack_require__(/*! rusha */ \"rusha\"));\r\nconst json_stable_stringify_1 = __importDefault(__webpack_require__(/*! json-stable-stringify */ \"json-stable-stringify\"));\r\nclass BasicCache {\r\n    constructor(cache = {}) {\r\n        this._cache = cache;\r\n    }\r\n    get(key) {\r\n        return this._cache[key];\r\n    }\r\n    set(key, snap) {\r\n        this._cache[key] = snap;\r\n    }\r\n}\r\nexports.BasicCache = BasicCache;\r\nfunction basicHashFunction(object) {\r\n    const hash = rusha_1.default.createHash();\r\n    hash.update(json_stable_stringify_1.default(object));\r\n    return hash.digest('hex');\r\n}\r\nfunction TreeHash(operations, baseHash, operationIndex, hashFunction) {\r\n    const operationHashes = operations\r\n        .slice(0, operationIndex)\r\n        .map(op => op.hash);\r\n    return hashFunction({\r\n        baseHash,\r\n        operations: operationHashes,\r\n    });\r\n}\r\nexports.TreeHash = TreeHash;\r\nfunction EvalTransforms(transforms, options) {\r\n    const { hashFunction, cacheObject, cacheTTL, shouldCache, } = Object.assign({\r\n        hashFunction: basicHashFunction,\r\n        shouldCache: () => true,\r\n    }, options || {});\r\n    return (base, operations) => {\r\n        let snap = base;\r\n        const baseHash = hashFunction(base);\r\n        let snapIndex = 0;\r\n        const treeHash = (index) => TreeHash(operations, baseHash, index, basicHashFunction);\r\n        if (cacheObject) {\r\n            // search reverse\r\n            for (let index = operations.length; index >= 0; index -= 1) {\r\n                const hash = treeHash(index);\r\n                if (cacheObject.get(hash)) {\r\n                    snap = cacheObject.get(hash);\r\n                    snapIndex = index;\r\n                    break;\r\n                }\r\n            }\r\n        }\r\n        for (let index = snapIndex; index < operations.length; index += 1) {\r\n            const operation = operations[index];\r\n            const result = transforms[operation.name](cloneDeep_1.default(snap), operation.data, operation.meta);\r\n            const hash = treeHash(index + 1);\r\n            if (cacheObject && shouldCache(operation, result, snap))\r\n                cacheObject.set(hash, Object.freeze(result), cacheTTL);\r\n            snap = result;\r\n        }\r\n        return snap;\r\n    };\r\n}\r\nexports.EvalTransforms = EvalTransforms;\r\nfunction ProcessOperations(operations, hashFunction = basicHashFunction) {\r\n    return operations.map((operation) => {\r\n        if (typeof operation === 'string') {\r\n            return {\r\n                name: operation,\r\n                timestamp: +new Date(),\r\n                hash: hashFunction({ action: operation }),\r\n            };\r\n        }\r\n        else {\r\n            return {\r\n                name: operation.name,\r\n                data: Object.freeze(operation.data),\r\n                meta: Object.freeze(operation.meta),\r\n                timestamp: operation.timestamp || +new Date(),\r\n                hash: hashFunction({ action: operation.name, data: operation.data, meta: operation.meta }),\r\n            };\r\n        }\r\n    });\r\n}\r\nexports.ProcessOperations = ProcessOperations;\r\nfunction ProcessOperation(operation, hashFunction = basicHashFunction) {\r\n    return ProcessOperations([operation], hashFunction)[0];\r\n}\r\nexports.ProcessOperation = ProcessOperation;\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/core/operation_transformer.ts?");

/***/ }),

/***/ "../../core/transaction_helper.ts":
/*!****************************************************************!*\
  !*** C:/GitHub/breadsplit/packages/core/transaction_helper.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst lodash_1 = __webpack_require__(/*! lodash */ \"lodash\");\r\nconst _1 = __webpack_require__(/*! . */ \"../../core/index.ts\");\r\nclass TransactionWeightsHelper {\r\n    constructor(trans, on) {\r\n        this.trans = trans;\r\n        this.on = on;\r\n    }\r\n    get participators() {\r\n        return this.trans[this.on];\r\n    }\r\n    set participators(value) {\r\n        this.trans[this.on] = value;\r\n    }\r\n    get totalWeights() {\r\n        return this.participators\r\n            .map(i => i.weight || 0)\r\n            .reduce((a, b) => a + b, 0);\r\n    }\r\n    get flexibleWeights() {\r\n        return this.participators\r\n            .filter(c => c.fee == null)\r\n            .map(i => i.weight || 0)\r\n            .reduce((a, b) => a + b, 0);\r\n    }\r\n    get fixedFees() {\r\n        return this.participators\r\n            .filter(c => c.fee != null)\r\n            .map(i => i.fee || 0)\r\n            .reduce((a, b) => a + b, 0);\r\n    }\r\n    get flexibleFees() {\r\n        return this.trans.total_fee - this.fixedFees;\r\n    }\r\n    getFee(participator, mode) {\r\n        if (mode === 'amount') {\r\n            if (participator.fee != null)\r\n                return participator.fee;\r\n            if (!this.flexibleWeights)\r\n                return 0;\r\n            return ((participator.weight || 0) / (this.flexibleWeights || 1)) * (this.flexibleFees);\r\n        }\r\n        if (mode === 'percent') {\r\n            const totalPercents = lodash_1.sumBy(this.participators, p => p.percent || 0);\r\n            return this.trans.total_fee * (participator.percent || 0) / totalPercents;\r\n        }\r\n        if (mode === 'average') {\r\n            const total = lodash_1.sumBy(this.participators, p => p.weight ? 1 : 0);\r\n            return participator.weight ? this.trans.total_fee / total : 0;\r\n        }\r\n        const totalWeights = lodash_1.sumBy(this.participators, p => p.weight || 0);\r\n        return this.trans.total_fee * (participator.weight || 0) / totalWeights;\r\n    }\r\n    gcdAmount() {\r\n        if (this.participators.length === 1) {\r\n            this.participators[0].weight = 1;\r\n            return;\r\n        }\r\n        const participators = this.participators.map(c => ({\r\n            uid: c.uid,\r\n            fee: this.getFee(c, 'amount'),\r\n        }));\r\n        const gcd = _1.GCD(participators.map(c => c.fee).filter(i => i));\r\n        this.participators.forEach((c) => {\r\n            const participator = participators.find(d => d.uid === c.uid);\r\n            if (participator && participator.fee != null)\r\n                c.weight = participator.fee / gcd;\r\n        });\r\n    }\r\n    gcdWeight() {\r\n        if (this.participators.length === 1) {\r\n            this.participators[0].weight = 1;\r\n            return;\r\n        }\r\n        const gcd = _1.GCD(this.participators.map(c => c.weight || 0).filter(i => i));\r\n        this.participators.forEach((c) => {\r\n            c.weight = (c.weight || 0) / gcd;\r\n        });\r\n    }\r\n    cleanUp(mode, removeZero = true) {\r\n        if (mode === 'average') {\r\n            this.participators.forEach((c) => {\r\n                c.weight = c.weight ? 1 : 0;\r\n            });\r\n        }\r\n        else if (mode === 'percent') {\r\n            this.participators.forEach((c) => {\r\n                c.weight = c.percent || c.weight || 0;\r\n            });\r\n            this.gcdWeight();\r\n        }\r\n        else if (mode === 'weight') {\r\n            this.gcdWeight();\r\n        }\r\n        else if (mode === 'amount') {\r\n            this.gcdAmount();\r\n        }\r\n        this.participators.forEach((c) => {\r\n            delete c.fee;\r\n            delete c.percent;\r\n            delete c.locked;\r\n        });\r\n        if (removeZero)\r\n            this.participators = this.participators.filter(c => c.weight);\r\n    }\r\n}\r\nexports.TransactionWeightsHelper = TransactionWeightsHelper;\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/core/transaction_helper.ts?");

/***/ }),

/***/ "../../core/transforms.ts":
/*!********************************************************!*\
  !*** C:/GitHub/breadsplit/packages/core/transforms.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/*\r\nThis file is shared both in client and server.\r\n\r\nIf you made any modification,\r\nPlease DO DEPLOY firebase functions before merge into master.\r\n*/\r\nconst cloneDeep_1 = __importDefault(__webpack_require__(/*! lodash/cloneDeep */ \"lodash/cloneDeep\"));\r\nexports.Transforms = {\r\n    init(snap, data, { by, timestamp } = {}) {\r\n        snap = Object.assign(snap || {}, cloneDeep_1.default(data));\r\n        if (!snap.activities)\r\n            snap.activities = [];\r\n        snap.activities.push({\r\n            by,\r\n            timestamp,\r\n            action: 'publish',\r\n            entity: 'group',\r\n        });\r\n        return snap;\r\n    },\r\n    modify_meta(snap, changes, { by, timestamp } = {}) {\r\n        if (!changes)\r\n            return snap;\r\n        changes = Object.assign({}, changes);\r\n        if (changes.name && snap.name !== changes.name) {\r\n            snap.name = changes.name;\r\n            snap.activities.push({\r\n                by,\r\n                timestamp,\r\n                action: 'update',\r\n                entity: 'group',\r\n                update_fields: 'name',\r\n                entity_name: changes.name,\r\n            });\r\n        }\r\n        if (changes.options) {\r\n            Object.assign(snap.options, changes.options);\r\n            delete changes.options;\r\n        }\r\n        if (changes.main_currency && snap.main_currency !== changes.main_currency) {\r\n            snap.main_currency = changes.main_currency;\r\n            snap.activities.push({\r\n                by,\r\n                timestamp,\r\n                action: 'update',\r\n                entity: 'group',\r\n                update_fields: 'currency',\r\n                entity_name: changes.main_currency,\r\n            });\r\n            // TODO: update transactions\r\n        }\r\n        if (changes.icon)\r\n            snap.icon = changes.icon;\r\n        if (changes.color)\r\n            snap.color = changes.color;\r\n        return snap;\r\n    },\r\n    insert_member(snap, member, { by, timestamp } = {}) {\r\n        if (!member)\r\n            return snap;\r\n        if (!member.uid)\r\n            return snap;\r\n        snap.members[member.uid] = member;\r\n        snap.activities.push({\r\n            by,\r\n            timestamp,\r\n            action: 'insert',\r\n            entity: 'member',\r\n            entity_id: member.uid,\r\n            entity_name: member.name,\r\n        });\r\n        return snap;\r\n    },\r\n    remove_member(snap, uid) {\r\n        if (!uid)\r\n            return snap;\r\n        if (!snap.members[uid])\r\n            return snap;\r\n        snap.members[uid].removed = true;\r\n        return snap;\r\n    },\r\n    modify_member(snap, data) {\r\n        if (!data)\r\n            return snap;\r\n        const { id, changes } = data;\r\n        if (!snap.members[id])\r\n            return snap;\r\n        Object.assign(snap.members[id], changes);\r\n        return snap;\r\n    },\r\n    insert_transaction(snap, transaction, { by, timestamp } = {}) {\r\n        if (!transaction)\r\n            return snap;\r\n        snap.transactions.push(transaction);\r\n        snap.activities.push({\r\n            by,\r\n            timestamp,\r\n            action: 'insert',\r\n            entity: 'transaction',\r\n            entity_id: transaction.id,\r\n            entity_name: transaction.desc,\r\n            entity_desc: `${transaction.currency} ${transaction.total_fee}`,\r\n        });\r\n        return snap;\r\n    },\r\n    modify_transaction(snap, transaction, { by, timestamp } = {}) {\r\n        if (!transaction)\r\n            return snap;\r\n        const target = snap.transactions.find(t => t.id === transaction.id);\r\n        if (!target)\r\n            return snap;\r\n        Object.assign(target, transaction);\r\n        snap.activities.push({\r\n            by,\r\n            timestamp,\r\n            action: 'update',\r\n            entity: 'transaction',\r\n            entity_id: transaction.id,\r\n            entity_name: transaction.desc,\r\n        });\r\n        return snap;\r\n    },\r\n    remove_transaction(snap, id, { by, timestamp } = {}) {\r\n        const transaction = snap.transactions.find(t => t.id === id);\r\n        if (!transaction)\r\n            return snap;\r\n        snap.transactions.splice(snap.transactions.indexOf(transaction), 1);\r\n        snap.activities.push({\r\n            by,\r\n            timestamp,\r\n            action: 'remove',\r\n            entity: 'transaction',\r\n            entity_id: transaction.id,\r\n            entity_name: transaction.desc,\r\n            entity_desc: `${transaction.currency} ${transaction.total_fee}`,\r\n        });\r\n        return snap;\r\n    },\r\n    change_member_id(snap, data) {\r\n        if (!data)\r\n            return snap;\r\n        const { from, to } = data;\r\n        if (!from || !to)\r\n            return snap;\r\n        const member = snap.members[from];\r\n        if (!member || snap.members[to])\r\n            return snap;\r\n        // change members field\r\n        member.uid = to;\r\n        member.name = ''; // reset member's name\r\n        delete snap.members[from];\r\n        snap.members[to] = member;\r\n        // utils function\r\n        function replacer(object, field) {\r\n            if (object[field] === from)\r\n                object[field] = to;\r\n        }\r\n        // change uids in transactions\r\n        for (const trans of snap.transactions) {\r\n            replacer(trans, 'creator');\r\n            for (const c of trans.creditors)\r\n                replacer(c, 'uid');\r\n            for (const d of trans.debtors)\r\n                replacer(d, 'uid');\r\n        }\r\n        return snap;\r\n    },\r\n    new_activity(snap, data) {\r\n        snap.activities.push(data);\r\n        return snap;\r\n    },\r\n};\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/core/transforms.ts?");

/***/ }),

/***/ "../../locales/de.yml":
/*!****************************************************!*\
  !*** C:/GitHub/breadsplit/packages/locales/de.yml ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const doc = [({\"code\":\"de\", \"iso\":\"de\", \"language_name\":\"Deutsche\", \"translators\":\"cleo\", \"appname\":\"BreadSplit\", \"appname_dev\":\"BreadSplit Dev\", \"ui\":({\"splitting\":({}), \"newtrans\":({})}), \"acts\":({})})];\nmodule.exports = doc.length <= 1 ? doc[0] : doc;\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/locales/de.yml?");

/***/ }),

/***/ "../../locales/en.yml":
/*!****************************************************!*\
  !*** C:/GitHub/breadsplit/packages/locales/en.yml ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const doc = [({\"acts\":({\"change_group_currency\":\"{0} changed main currency to {1}\", \"insert_group\":\"{0} created the group\", \"insert_member\":\"{0} added a member {1}\", \"insert_transaction\":\"{0} added an expense {1}\", \"insert_viewer\":\"{0} joined the group\", \"publish_group\":\"{0} changed group to online mode\", \"remove_transaction\":\"{0} deleted an expense {1}\", \"rename_group\":\"{0} changed group name to {1}\", \"update_transaction\":\"{0} modified an expense {1}\"}), \"appname\":\"BreadSplit\", \"appname_dev\":\"BreadSplit Dev\", \"cats\":({\"entertainment\":({\"display\":\"Entertain\", \"keywords\":\"\"}), \"food\":({\"display\":\"Food\", \"keywords\":\"food,drink,meal,breakfast,lunch,dinner\"}), \"home\":({\"display\":\"Home\", \"keywords\":\"\"}), \"lodging\":({\"display\":\"Lodging\", \"keywords\":\"hotel\"}), \"other\":({\"display\":\"Other\", \"keywords\":\"\"}), \"shopping\":({\"display\":\"Shopping\", \"keywords\":\"shopping\"}), \"tips\":({\"display\":\"Tips\", \"keywords\":\"tip,tips\"}), \"transfer\":({\"display\":\"Transfer\", \"keywords\":\"hotel\"}), \"transport\":({\"display\":\"Transport\", \"keywords\":\"uber,grab,transport,mrt,lrt,bus,taxi,ship,airplane,flight,car\"}), \"travel\":({\"display\":\"Travel\", \"keywords\":\"\"})}), \"code\":\"en\", \"css\":({\"font_of_locale\":\"\"}), \"feedback\":({\"contact_info\":\"Contact Info\", \"describe\":\"Describe your issue or sugesstions.\", \"github_hint\":\"Or you can create an issue on our {0}\"}), \"help\":({\"no_password_login\":({\"details\":\"\", \"tips\":\"No login with email and password?\", \"title\":\"\"}), \"online_mode\":({\"details\":\"Online mode provides functions like sharing and collaborating.<br> Offline mode change be switch to online any time you want, while online mode can not switch back to offline mode.<br> Note: You have to login to use online mode.\", \"title\":\"Online mode\"}), \"splitting_intro\":({\"details\":\"\", \"title\":\"What is Splitting?\"}), \"support\":({\"details\":\"\", \"title\":\"How can I support this project?\"})}), \"iso\":\"en-US\", \"language_name\":\"English\", \"noun\":({\"expense\":\"Expense\", \"today\":\"Today\", \"tomorrow\":\"Tomorrow\", \"yesterday\":\"Yesterday\"}), \"prompt\":({\"are_you_sure\":\"Are you sure?\", \"feedback_delivered\":\"Your feedback is delivered. Thank you ❤\", \"invite_friends\":\"Invite friends\", \"sending\":\"Sending...\", \"share_message\":\"Click to join $1\"}), \"pronoun\":({\"anonymous\":\"Anonymous\", \"i\":\"I\", \"me\":\"Me\"}), \"tips\":({\"already_joined_group\":\"You have already joined this group.\", \"click_right_corner_icon\":\"Please click the \\\"{0}\\\" icon\", \"member_name_input_placeholder\":\"Enter member's name\", \"open_in_browser_general\":\"Open in browser\", \"select_open_in_browser\":\"Then select {0}\"}), \"translators\":\"official\", \"ui\":({\"about\":\"About us\", \"advance\":\"Advance\", \"become_a_patreon\":\"Become a Patreon\", \"button_back\":\"Back\", \"button_cancel\":\"Cancel\", \"button_confirm\":\"Confirm\", \"button_create\":\"Create\", \"button_create_group\":\"Create Group\", \"button_finish\":\"Finish\", \"button_go_home\":\"Go Home\", \"button_join\":\"Join\", \"button_join_group\":\"Join the group\", \"button_more_about_us\":\"More about us\", \"button_new_group\":\"Create a new group\", \"button_new_member\":\"Add a member\", \"button_next\":\"Next\", \"button_no\":\"No\", \"button_ok\":\"OK\", \"button_refresh\":\"Reload\", \"button_save\":\"Save\", \"button_send\":\"Send\", \"button_submit\":\"Submit\", \"button_yes\":\"Yes\", \"continue_and_accept\":\"By continue, you accept our {0}\", \"continue_anyway\":\"Continue anyway\", \"currency\":\"Currency\", \"donate_on_paypal\":\"One-time donation on PayPal\", \"faq\":\"FAQ\", \"feedback\":\"Feedback\", \"general\":\"General\", \"group_editing\":({\"add_member_xx\":\"Add \\\"{0}\\\"\", \"add_members\":\"Add members\", \"default_group_name\":\"Untitled Group\", \"enter_group_name\":\"Enter group's name\", \"group_name\":\"Group's name\", \"new_group\":\"New group\"}), \"help\":\"Help\", \"homepage\":\"Home\", \"join\":({\"existing_users\":\"Existing users\", \"group_not_found\":\"Group Not Found\", \"invited_to_join\":\"You are invited to join group {0}\", \"join_anonymous\":\"Join as a new member\", \"loading_group_info\":\"Loading group info...\", \"my_name_is\":\"My name is:\", \"this_is_me\":\"This is me\", \"title\":\"Join a group\"}), \"join_as_me\":\"Join as {0}\", \"join_group\":\"Joining <b>{0}</b>\", \"language\":\"Language\", \"loading\":\"Loading...\", \"menu\":({\"edit_group\":\"Edit group\", \"make_group_online\":\"Make this group online\", \"member_is_me\":\"This is me\", \"remove_group\":\"Remove group\", \"remove_member\":\"Remove {name} from group\", \"rename_member\":\"Rename\", \"view_group\":\"View group\"}), \"misc\":\"Misc.\", \"more_currency\":\"More...\", \"new_expense\":\"New expense\", \"newtrans\":({\"add_location\":\"Add location\", \"add_payer\":\"Add more payer\", \"description\":\"Description\", \"details\":\"Details\", \"details_short\":\"Details\", \"expense_paid_by\":\"Expense paid by?\", \"for_whom\":\"For whom?\", \"how_much\":\"How much?\", \"how_much_short\":\"Fee\", \"repeat_expense\":\"Repeat\", \"select_who_paid\":\"Select the person who paid the bill\", \"xx_should_pay\":\"by the way, {0} should pay this time.\"}), \"offline_mode\":\"Offline mode\", \"online_mode\":\"Online mode\", \"optional\":\"(Optional)\", \"paid_by\":\"Paid by\", \"paid_by_xx\":\"Paid by {0}\", \"privacy_policy\":\"Privacy policy\", \"reset\":\"Reset\", \"search_currency\":\"Search currency...\", \"select_currency\":\"Select currency\", \"setting_options\":({\"clear_all_data\":\"Clear all Data\", \"dark_mode\":\"Dark mode\", \"disabled\":\"Disabled\", \"enabled\":\"Enabled\", \"notification\":\"Notification\", \"notification_disabled\":\"Notifications are disabled\", \"notification_enabled\":\"Notifications are enabled\", \"reset\":\"Reset\"}), \"settings\":\"Settings\", \"settle_up_solution\":\"{0} should pay {2} back to {1}\", \"share\":({\"join_via_link\":\"Join via link\", \"join_via_link_disabled\":\"Joining this group via link is disabled\", \"join_via_link_enabled\":\"Anyone with the link can join this group\", \"share_link\":\"Share link\"}), \"share_link_copied\":\"Share link copied!\", \"share_link_to_invite\":\"Share this link to invite friends\", \"show-all\":\"Show all\", \"sign_in\":\"Sign in\", \"signin_options\":({\"Facebook\":\"Sign in with Facebook\", \"Github\":\"Sign in with Github\", \"Google\":\"Sign in with Google\", \"tip\":\"Sign in to activate Backup & Sync\"}), \"splitting\":({\"amount\":\"Amount\", \"average\":\"Equally\", \"mode_average_details\":\"Splitting with {0} people, each of them spent\", \"mode_average_tip\":\"Select those who spent with this expense\", \"percent\":\"Percent\", \"split_by\":\"Split by\", \"split_by_short\":\"Split\", \"total\":\"Total expense: {0}\", \"weight\":\"Weights\"}), \"star_on_github\":\"Star on Github\", \"support_us\":\"Support us\", \"tabs\":({\"activities\":\"Activities\", \"balances\":\"Balances\", \"expenses\":\"Expenses\", \"members\":\"Members\", \"settle_up\":\"Settle Up\", \"summary\":\"Summary\", \"transactions\":\"Transactions\"}), \"total\":\"Total\", \"welcome_breadsplit\":\"Welcome to BreadSplit!\", \"wip\":\"🚧 Working in progress...\", \"xx_paid_money\":\"{0} paid\", \"xx_paid_xx\":\"{0} paid {1}\"}), \"utils\":({\"bypass_1\":\"{0}\"})})];\nmodule.exports = doc.length <= 1 ? doc[0] : doc;\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/locales/en.yml?");

/***/ }),

/***/ "../../locales/fr.yml":
/*!****************************************************!*\
  !*** C:/GitHub/breadsplit/packages/locales/fr.yml ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const doc = [({\"code\":\"fr\", \"iso\":\"fr\", \"language_name\":\"Français\", \"translators\":\"\", \"css\":({\"font_of_locale\":\"\"}), \"ui\":({\"button_join_group\":\"Rejoindre le groupe\", \"group_editing\":({\"new_group\":\"Nouvelle équipe\", \"group_name\":\"Nom du groupe\"}), \"homepage\":\"Accueil\", \"button_create\":\"Créer\", \"setting_options\":({\"notification_enabled\":\"Les notifications sont activées\", \"notification_disabled\":\"Les notifications sont désactivées\", \"clear_all_data\":\"Effacer toutes les données\"}), \"tabs\":({}), \"help\":\"Aide\", \"newtrans\":({}), \"splitting\":({})}), \"acts\":({}), \"noun\":({}), \"appname\":\"BreadSplit\"})];\nmodule.exports = doc.length <= 1 ? doc[0] : doc;\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/locales/fr.yml?");

/***/ }),

/***/ "../../locales/index.ts":
/*!******************************************************!*\
  !*** C:/GitHub/breadsplit/packages/locales/index.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/* eslint-disable @typescript-eslint/no-var-requires */\r\nconst en = __webpack_require__(/*! ./en.yml */ \"../../locales/en.yml\");\r\nconst zhcn = __webpack_require__(/*! ./zh-cn.yml */ \"../../locales/zh-cn.yml\");\r\nconst zhtw = __webpack_require__(/*! ./zh-tw.yml */ \"../../locales/zh-tw.yml\");\r\nconst fr = __webpack_require__(/*! ./fr.yml */ \"../../locales/fr.yml\");\r\nconst ja = __webpack_require__(/*! ./ja.yml */ \"../../locales/ja.yml\");\r\nconst de = __webpack_require__(/*! ./de.yml */ \"../../locales/de.yml\");\r\nexports.EN_MESSAGES = en;\r\nexports.Messages = {\r\n    en,\r\n    fr,\r\n    ja,\r\n    'zh-cn': zhcn,\r\n    'zh-tw': zhtw,\r\n    de,\r\n};\r\nexports.AvaliableLocales = Object\r\n    .values(exports.Messages)\r\n    .map((locale) => {\r\n    return {\r\n        code: locale.code,\r\n        iso: locale.iso,\r\n        display: locale.language_name,\r\n    };\r\n});\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/locales/index.ts?");

/***/ }),

/***/ "../../locales/ja.yml":
/*!****************************************************!*\
  !*** C:/GitHub/breadsplit/packages/locales/ja.yml ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const doc = [({\"code\":\"ja\", \"iso\":\"ja\", \"language_name\":\"日本語\", \"translators\":\"\", \"css\":({\"font_of_locale\":\"\"}), \"ui\":({\"group_editing\":({\"new_group\":\"新チーム\", \"group_name\":\"グループ名\"}), \"button_join_group\":\"グループに参加する\", \"homepage\":\"ホーム\", \"button_create\":\"作成する\", \"setting_options\":({\"notification_enabled\":\"通知が有効になります\", \"notification_disabled\":\"通知は無効になります\", \"clear_all_data\":\"すべてのデータを消去\"}), \"tabs\":({}), \"newtrans\":({}), \"splitting\":({})}), \"acts\":({}), \"noun\":({})})];\nmodule.exports = doc.length <= 1 ? doc[0] : doc;\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/locales/ja.yml?");

/***/ }),

/***/ "../../locales/zh-cn.yml":
/*!*******************************************************!*\
  !*** C:/GitHub/breadsplit/packages/locales/zh-cn.yml ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const doc = [({\"acts\":({}), \"appname\":\"分账吐司\", \"appname_dev\":\"分账吐司 Dev\", \"cats\":({\"food\":({\"display\":\"\", \"keywords\":\"\"}), \"lodging\":({\"display\":\"\", \"keywords\":\"\"}), \"other\":({\"display\":\"\"}), \"transfer\":({\"display\":\"\"}), \"transport\":({\"display\":\"\", \"keywords\":\"\"}), \"travel\":({\"display\":\"\"})}), \"code\":\"zh-cn\", \"css\":({\"font_of_locale\":\"\\\"微軟雅黑\\\", \\\"Microsoft YaHei\\\"\"}), \"iso\":\"zh-CN\", \"language_name\":\"简体中文\", \"noun\":({\"expense\":\"支出\"}), \"prompt\":({\"are_you_sure\":\"你确定吗？\"}), \"translators\":\"antfu<anthonyfu117@hotmail.com>\", \"ui\":({\"about\":\"关于我们\", \"button_back\":\"返回\", \"button_cancel\":\"取消\", \"button_create\":\"创建\", \"button_finish\":\"完成\", \"button_join_group\":\"加入小组\", \"button_new_group\":\"新建小组\", \"button_new_member\":\"添加成员\", \"button_next\":\"下一步\", \"button_no\":\"否\", \"button_save\":\"保存\", \"button_yes\":\"是\", \"group_editing\":({\"add_members\":\"添加成员\", \"default_group_name\":\"未命名小组\", \"enter_group_name\":\"请输入小组名称\", \"group_name\":\"小组名称\", \"new_group\":\"新建小组\"}), \"homepage\":\"首页\", \"language\":\"显示语言\", \"newtrans\":({\"add_location\":\"添加位置\", \"add_payer\":\"添加付款人\", \"details\":\"\", \"expense_paid_by\":\"费用由谁支付？\", \"how_much\":\"输入金额\", \"repeat_expense\":\"重复\", \"xx_should_pay\":\"这次轮到 {0} 付款。\"}), \"offline_mode\":\"离线模式\", \"online_mode\":\"在线模式\", \"setting_options\":({\"clear_all_data\":\"清除所有数据\", \"notification_disabled\":\"通知已禁用\", \"notification_enabled\":\"通知已启用\"}), \"settings\":\"设置\", \"sign_in\":\"登陆\", \"star_on_github\":\"Star on Github\", \"tabs\":({\"expenses\":\"支出\", \"members\":\"小组成员\", \"summary\":\"总览\"}), \"total\":\"合计\"})})];\nmodule.exports = doc.length <= 1 ? doc[0] : doc;\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/locales/zh-cn.yml?");

/***/ }),

/***/ "../../locales/zh-tw.yml":
/*!*******************************************************!*\
  !*** C:/GitHub/breadsplit/packages/locales/zh-tw.yml ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const doc = [({\"acts\":({\"change_group_currency\":\"{0} 將貨幣更改為 {1}\", \"insert_group\":\"{0} 創建了群組\", \"insert_member\":\"{0} 添加了成員: {1}\", \"insert_transaction\":\"{0} 添加了支出 {1}\", \"insert_viewer\":\"{0} 加入了群組\", \"publish_group\":\"{0} 將群組轉換為在綫模式\", \"remove_transaction\":\"{0} 刪除了支出 {1}\", \"rename_group\":\"{0} 將群組更名為 {1}\", \"update_transaction\":\"{0} 修改了支出 {1}\"}), \"appname\":\"分帳吐司\", \"appname_dev\":\"分帳吐司 Dev\", \"cats\":({\"entertainment\":({\"display\":\"娛樂\"}), \"food\":({\"display\":\"飲食\", \"keywords\":\"早餐,午餐,晚餐,宵夜,餐廳,飲料,奶茶,甜品\"}), \"home\":({\"display\":\"家庭\"}), \"lodging\":({\"display\":\"住宿\", \"keywords\":\"飯店,酒店,民宿,住宿,青旅\"}), \"other\":({\"display\":\"其他\"}), \"shopping\":({\"display\":\"購物\", \"keywords\":\"購物\"}), \"tips\":({\"display\":\"小費\", \"keywords\":\"tip,小費\"}), \"transfer\":({\"display\":\"轉移\", \"keywords\":\"轉移\"}), \"transport\":({\"display\":\"交通\", \"keywords\":\"地鐵,捷運,mrt,計程車,飛機,機票,公車,uber,mrt,lrt,grab,的士,船票,火車,高鐵,輕軌,車票\"}), \"travel\":({\"display\":\"旅行\", \"keywords\":\"旅行,門票,景點\"})}), \"code\":\"zh-tw\", \"css\":({\"font_of_locale\":\"\\\"微軟正黑體\\\", \\\"Microsoft JhengHei\\\"\"}), \"feedback\":({\"contact_info\":\"聯絡方式\", \"describe\":\"請描述您的問題或建議。\", \"github_hint\":\"或者您也可以在 {0} 上創建Issue\"}), \"help\":({\"no_password_login\":({\"details\":\"我們使用一種稱爲 OAuth 的技術接入由 Google、Facebook 等平台提供的賬戶驗證服務。 通過 OAuth，我們<b>不會</b>獲得您的密碼等敏感信息。<br> 同時，這種方式可以減少您輸入密碼的次數，以更好地確保您的賬戶安全。\", \"tips\":\"沒有使用賬號密碼的登入方式？\", \"title\":\"不使用賬號密碼登入\"})}), \"iso\":\"zh-TW\", \"language_name\":\"繁體中文\", \"noun\":({\"expense\":\"支出\", \"today\":\"今天\", \"tomorrow\":\"明天\", \"yesterday\":\"昨天\"}), \"prompt\":({\"are_you_sure\":\"你確定嗎？\", \"feedback_delivered\":\"您的意見回饋已經成功寄出，感謝您的支持！\", \"invite_friends\":\"邀請好友\", \"sending\":\"發送中...\", \"share_message\":\"點擊加入 $1\"}), \"pronoun\":({\"anonymous\":\"匿名\", \"i\":\"我\", \"me\":\"我\"}), \"tips\":({\"already_joined_group\":\"你已經加入了此群組。\", \"click_right_corner_icon\":\"請點選右上角 \\\"{0}\\\" 圖標\", \"member_name_input_placeholder\":\"輸入成員昵稱\", \"select_open_in_browser\":\"選擇 {0}\"}), \"translators\":\"official\", \"ui\":({\"about\":\"關於我們\", \"advance\":\"進階\", \"become_a_patreon\":\"在 Patreon 上成為贊助者\", \"button_back\":\"返回\", \"button_calculate\":\"計算\", \"button_cancel\":\"取消\", \"button_confirm\":\"確認\", \"button_create\":\"創建\", \"button_create_group\":\"創建群組\", \"button_finish\":\"完成\", \"button_go_home\":\"返回App\", \"button_join\":\"加入\", \"button_join_group\":\"加入群組\", \"button_more_about_us\":\"更多關於我們\", \"button_new_group\":\"新增群組\", \"button_new_member\":\"添加成員\", \"button_next\":\"下一步\", \"button_no\":\"否\", \"button_ok\":\"好的\", \"button_refresh\":\"重新整理\", \"button_save\":\"儲存\", \"button_send\":\"發送\", \"button_submit\":\"提交\", \"button_yes\":\"是\", \"continue_and_accept\":\"繼續使用即表示您同意我們的{0}\", \"continue_anyway\":\"仍然繼續\", \"currency\":\"幣種\", \"donate_on_paypal\":\"PayPal 一次性贊助\", \"faq\":\"常見問題\", \"feedback\":\"意見回饋\", \"general\":\"一般\", \"group_editing\":({\"add_member_xx\":\"添加成員 \\\"{0}\\\"\", \"add_members\":\"添加成員\", \"default_group_name\":\"未命名群組\", \"enter_group_name\":\"請輸入群組名稱\", \"group_name\":\"群組名稱\", \"new_group\":\"新建群組\"}), \"help\":\"使用幫助\", \"homepage\":\"首頁\", \"join\":({\"existing_users\":\"已存在用戶\", \"group_not_found\":\"沒有找到群組\", \"invited_to_join\":\"您被邀請加入 {0} 小組\", \"join_anonymous\":\"新增成員\", \"loading_group_info\":\"正在加載群組信息...\", \"my_name_is\":\"我的名字是:\", \"this_is_me\":\"這是我\", \"title\":\"加入群組\"}), \"join_as_me\":\"以 {0} 加入\", \"language\":\"語言\", \"menu\":({\"edit_group\":\"編輯群組\", \"make_group_online\":\"轉換為綫上模式\", \"member_is_me\":\"這是我\", \"remove_group\":\"刪除群組\", \"remove_member\":\"將 {name} 從群組中移除\", \"rename_member\":\"重命名\", \"view_group\":\"檢視群組\"}), \"misc\":\"其他\", \"more_currency\":\"更多...\", \"new_expense\":\"新的支出\", \"newtrans\":({\"add_location\":\"添加位置\", \"add_payer\":\"添加付款人\", \"description\":\"描述\", \"details\":\"明細\", \"details_short\":\"明細\", \"expense_paid_by\":\"由誰支付？\", \"for_whom\":\"為了誰？\", \"how_much\":\"付款金額\", \"how_much_short\":\"金額\", \"repeat_expense\":\"重複\", \"select_who_paid\":\"選擇付款人\", \"xx_should_pay\":\"這次輪到 {0} 付款。\"}), \"offline_mode\":\"離線模式\", \"online_mode\":\"綫上模式\", \"optional\":\"（可選）\", \"paid_by\":\"付款人\", \"paid_by_xx\":\"由 {0} 付款\", \"privacy_policy\":\"隱私政策\", \"select_currency\":\"選擇貨幣\", \"setting_options\":({\"clear_all_data\":\"清除所有數據\", \"dark_mode\":\"深色模式\", \"disabled\":\"關閉\", \"enabled\":\"開啓\", \"notification\":\"通知\", \"notification_disabled\":\"通知已禁用\", \"notification_enabled\":\"通知已啟用\", \"reset\":\"重置\"}), \"settings\":\"設定\", \"settle_up_solution\":\"{0} 需要還 {2} 給 {1}\", \"share_link_copied\":\"分享鏈接已復制！\", \"sign_in\":\"登錄\", \"signin_options\":({\"Facebook\":\"使用臉書登入\", \"Github\":\"使用 Github 登入\", \"Google\":\"使用 Google 登入\", \"tip\":\"登入您的帳戶，以啟用備份與同步功能\"}), \"splitting\":({\"amount\":\"按金額\", \"average\":\"均分制\", \"mode_average_details\":\"{0} 人參與分帳，平均每個人花費\", \"mode_average_tip\":\"選擇參與這筆支出的人\", \"percent\":\"按趴數\", \"split_by\":\"分帳方式\", \"split_by_short\":\"分帳\", \"total\":\"支出金額: {0}\", \"weight\":\"按權重\"}), \"star_on_github\":\"Star on Github\", \"support_us\":\"支持我們\", \"tabs\":({\"activities\":\"記錄\", \"balances\":\"債務情況\", \"expenses\":\"支出\", \"members\":\"成員\", \"settle_up\":\"算清債務\", \"summary\":\"總覽\", \"transactions\":\"交易記錄\"}), \"total\":\"合計\", \"welcome_breadsplit\":\"歡迎使用分帳吐司!\", \"wip\":\"🚧 功能開發中，敬請期待…\", \"xx_paid_money\":\"{0} 支付了\", \"xx_paid_xx\":\"{0} 支付了 {1}\"})})];\nmodule.exports = doc.length <= 1 ? doc[0] : doc;\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/locales/zh-tw.yml?");

/***/ }),

/***/ "../../utils/formatters.ts":
/*!*********************************************************!*\
  !*** C:/GitHub/breadsplit/packages/utils/formatters.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst dayjs_config_1 = __importDefault(__webpack_require__(/*! ../core/dayjs_config */ \"../../core/dayjs_config.ts\"));\r\nconst i18n_1 = __webpack_require__(/*! ./i18n */ \"../../utils/i18n.ts\");\r\nfunction getTimezone() {\r\n    return Intl.DateTimeFormat().resolvedOptions().timeZone;\r\n}\r\nexports.getTimezone = getTimezone;\r\nfunction dateFromNow(time, locale) {\r\n    const d = dayjs_config_1.default(time);\r\n    const now = dayjs_config_1.default();\r\n    if (now.diff(d, 'year') >= 1)\r\n        return d.toDate().toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'long' });\r\n    if (now.diff(d, 'day') >= 1)\r\n        return d.toDate().toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });\r\n    return d.fromNow();\r\n}\r\nexports.dateFromNow = dateFromNow;\r\nfunction getWeekOfYear(time) {\r\n    const d = dayjs_config_1.default(time);\r\n    // ISO 8601 states that week 1 is the week\r\n    // with january 4th in it\r\n    const jan4 = d.set('month', 1).set('day', 4);\r\n    const start = jan4.startOf('week');\r\n    const now = d.startOf('week');\r\n    return now.diff(start, 'week');\r\n}\r\nexports.getWeekOfYear = getWeekOfYear;\r\nfunction dateToRelative(time, $t = i18n_1.t, locale) {\r\n    const d = dayjs_config_1.default(time);\r\n    const days = dayjs_config_1.default().diff(d, 'day');\r\n    if (days === 0)\r\n        return $t('noun.today', locale).toString();\r\n    if (days === 1)\r\n        return $t('noun.yesterday', locale).toString();\r\n    // refer to https://github.com/iamkun/dayjs/blob/dev/docs/en/Plugin.md#localizedformat\r\n    return d.format('ll');\r\n}\r\nexports.dateToRelative = dateToRelative;\r\nfunction numberToMoney(value, locale = 'en', currency, digits = 2) {\r\n    const formatter = new Intl.NumberFormat(locale, {\r\n        style: currency ? 'currency' : undefined,\r\n        currency,\r\n        minimumFractionDigits: digits,\r\n        maximumFractionDigits: digits,\r\n    });\r\n    return formatter.format(value);\r\n}\r\nexports.numberToMoney = numberToMoney;\r\nfunction capitalize(s) {\r\n    return s.charAt(0).toUpperCase() + s.slice(1);\r\n}\r\nexports.capitalize = capitalize;\r\nfunction capitalizeEachWords(s, delimiter = ' ') {\r\n    return s.split(delimiter).map(w => capitalize(w)).join(delimiter);\r\n}\r\nexports.capitalizeEachWords = capitalizeEachWords;\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/utils/formatters.ts?");

/***/ }),

/***/ "../../utils/i18n.ts":
/*!***************************************************!*\
  !*** C:/GitHub/breadsplit/packages/utils/i18n.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst get_1 = __importDefault(__webpack_require__(/*! lodash/get */ \"lodash/get\"));\r\nconst locales_1 = __webpack_require__(/*! ../locales */ \"../../locales/index.ts\");\r\nfunction getValue(key, locale, fallback = 'en') {\r\n    let value = get_1.default(locales_1.Messages, `${locale}.${key}`) || '';\r\n    if (!value)\r\n        value = get_1.default(locales_1.Messages, `${fallback}.${key}`) || '';\r\n    return value.toString();\r\n}\r\nexports.getValue = getValue;\r\nfunction format(str, args) {\r\n    return str.replace(/{(\\d+)}/g, (match, number) => {\r\n        return typeof args[number] !== 'undefined'\r\n            ? args[number].toString()\r\n            : match;\r\n    });\r\n}\r\n;\r\nfunction t(key, locale = 'en', values, fallback = 'en') {\r\n    const value = getValue(key, locale, fallback);\r\n    return format(value, values || []);\r\n}\r\nexports.t = t;\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/utils/i18n.ts?");

/***/ }),

/***/ "../../utils/index.ts":
/*!****************************************************!*\
  !*** C:/GitHub/breadsplit/packages/utils/index.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nfunction __export(m) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n__export(__webpack_require__(/*! ./formatters */ \"../../utils/formatters.ts\"));\r\n__export(__webpack_require__(/*! ./i18n */ \"../../utils/i18n.ts\"));\r\n\n\n//# sourceURL=webpack:///C:/GitHub/breadsplit/packages/utils/index.ts?");

/***/ }),

/***/ "./src/_helpers.ts":
/*!*************************!*\
  !*** ./src/_helpers.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importStar = (this && this.__importStar) || function (mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\r\n    result[\"default\"] = mod;\r\n    return result;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst functions = __importStar(__webpack_require__(/*! firebase-functions */ \"firebase-functions\"));\r\nconst admin = __importStar(__webpack_require__(/*! firebase-admin */ \"firebase-admin\"));\r\nconst opschain_1 = __webpack_require__(/*! ./utils/opschain */ \"./src/utils/opschain.ts\");\r\nexports.db = admin.firestore();\r\nexports.GroupsRef = (id) => exports.db.collection('groups').doc(id);\r\nexports.OperationsRef = (id) => exports.db.collection('_operations').doc(id);\r\nexports.ExchangeRef = (id) => exports.db.collection('exchanges').doc(id);\r\nexports.f = functions.https.onCall;\r\nfunction recalculateGroupOperations(t, groupid, ops) {\r\n    const present = opschain_1.Eval(ops);\r\n    t.update(exports.OperationsRef(groupid), 'operations', opschain_1.omitDeep(ops));\r\n    t.update(exports.GroupsRef(groupid), opschain_1.omitDeep({\r\n        present,\r\n        'operations': ops.map(o => o.hash),\r\n    }));\r\n}\r\nexports.recalculateGroupOperations = recalculateGroupOperations;\r\n\n\n//# sourceURL=webpack:///./src/_helpers.ts?");

/***/ }),

/***/ "./src/changeGroupOptions.ts":
/*!***********************************!*\
  !*** ./src/changeGroupOptions.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst ts_optchain_1 = __webpack_require__(/*! ts-optchain */ \"../../../node_modules/ts-optchain/dist/proxy/index.js\");\r\nconst _helpers_1 = __webpack_require__(/*! ./_helpers */ \"./src/_helpers.ts\");\r\nexports.changeGroupOptions = _helpers_1.f(async ({ id, changes }, context) => {\r\n    if (!context.auth || !context.auth.uid)\r\n        throw new Error('auth_required');\r\n    const doc = await _helpers_1.GroupsRef(id).get();\r\n    if (!doc.exists)\r\n        throw new Error('group_not_exists');\r\n    const originalOptions = ts_optchain_1.oc(doc.data()).options({});\r\n    await _helpers_1.GroupsRef(id).update('options', Object.assign({}, originalOptions, changes));\r\n});\r\n\n\n//# sourceURL=webpack:///./src/changeGroupOptions.ts?");

/***/ }),

/***/ "./src/getExchangeRate.ts":
/*!********************************!*\
  !*** ./src/getExchangeRate.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst firebase_functions_1 = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\r\nconst dayjs_1 = __importDefault(__webpack_require__(/*! dayjs */ \"dayjs\"));\r\nconst axios_1 = __importDefault(__webpack_require__(/*! axios */ \"axios\"));\r\nconst _helpers_1 = __webpack_require__(/*! ./_helpers */ \"./src/_helpers.ts\");\r\n// firebase functions:config:set fixer.token=\"xxx\"\r\nconst FIXER_TOKEN = (firebase_functions_1.config().fixer || {}).token;\r\nconst API_URL = (date) => `http://data.fixer.io/api/${date}?access_key=${FIXER_TOKEN}`;\r\nfunction formatDate(date) {\r\n    return dayjs_1.default(date).format('YYYY-MM-DD');\r\n}\r\nasync function queryExchangeRates(date) {\r\n    const date_string = formatDate(date);\r\n    try {\r\n        const r = await axios_1.default.get(API_URL(date_string));\r\n        if (r.data.success === true) {\r\n            return Object.assign({}, r.data, {\r\n                provider: 'fixer',\r\n            });\r\n        }\r\n    }\r\n    catch (_a) { }\r\n    return undefined;\r\n}\r\nexports.getExchangeRate = _helpers_1.f(async ({ date } = {}, context) => {\r\n    const d = dayjs_1.default(date);\r\n    if (d.isBefore('2019-01-01'))\r\n        return undefined;\r\n    if (d.isAfter(dayjs_1.default(), 'day'))\r\n        return undefined;\r\n    date = formatDate(d);\r\n    const doc = await _helpers_1.ExchangeRef(date).get();\r\n    if (doc.exists)\r\n        return doc.data();\r\n    const data = await queryExchangeRates(date);\r\n    if (data)\r\n        await _helpers_1.ExchangeRef(date).set(data);\r\n    return data;\r\n});\r\n\n\n//# sourceURL=webpack:///./src/getExchangeRate.ts?");

/***/ }),

/***/ "./src/groupsCount.ts":
/*!****************************!*\
  !*** ./src/groupsCount.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importStar = (this && this.__importStar) || function (mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\r\n    result[\"default\"] = mod;\r\n    return result;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst admin = __importStar(__webpack_require__(/*! firebase-admin */ \"firebase-admin\"));\r\nconst _helpers_1 = __webpack_require__(/*! ./_helpers */ \"./src/_helpers.ts\");\r\nexports.groupsCount = _helpers_1.f(async (data, context) => {\r\n    const groups = await admin.firestore().collection('groups').get();\r\n    if (groups.empty)\r\n        return 0;\r\n    return groups.size;\r\n});\r\n\n\n//# sourceURL=webpack:///./src/groupsCount.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nfunction __export(m) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n__webpack_require__(/*! ./init */ \"./src/init.ts\");\r\n__export(__webpack_require__(/*! ./getExchangeRate */ \"./src/getExchangeRate.ts\"));\r\n__export(__webpack_require__(/*! ./groupsCount */ \"./src/groupsCount.ts\"));\r\n__export(__webpack_require__(/*! ./joinGroup */ \"./src/joinGroup.ts\"));\r\n__export(__webpack_require__(/*! ./publishGroup */ \"./src/publishGroup.ts\"));\r\n__export(__webpack_require__(/*! ./removeGroup */ \"./src/removeGroup.ts\"));\r\n__export(__webpack_require__(/*! ./changeGroupOptions */ \"./src/changeGroupOptions.ts\"));\r\n__export(__webpack_require__(/*! ./uploadOperations */ \"./src/uploadOperations.ts\"));\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/init.ts":
/*!*********************!*\
  !*** ./src/init.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importStar = (this && this.__importStar) || function (mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\r\n    result[\"default\"] = mod;\r\n    return result;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst admin = __importStar(__webpack_require__(/*! firebase-admin */ \"firebase-admin\"));\r\nadmin.initializeApp();\r\n\n\n//# sourceURL=webpack:///./src/init.ts?");

/***/ }),

/***/ "./src/joinGroup.ts":
/*!**************************!*\
  !*** ./src/joinGroup.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst _helpers_1 = __webpack_require__(/*! ./_helpers */ \"./src/_helpers.ts\");\r\nconst core_1 = __webpack_require__(/*! ./utils/core */ \"./src/utils/core.ts\");\r\nconst opschain_1 = __webpack_require__(/*! ./utils/opschain */ \"./src/utils/opschain.ts\");\r\nexports.joinGroup = _helpers_1.f(async ({ id, join_as }, context) => {\r\n    if (!context.auth || !context.auth.uid)\r\n        throw new Error('auth_required');\r\n    const uid = context.auth.uid;\r\n    await _helpers_1.db.runTransaction(async (t) => {\r\n        const group = (await t.get(_helpers_1.GroupsRef(id))).data();\r\n        const ops = (await t.get(_helpers_1.OperationsRef(id))).data();\r\n        if (!group || !ops || !group.public)\r\n            throw new Error('group_not_exists');\r\n        // skip if user already inside the group\r\n        if (group.viewers.includes(uid))\r\n            return;\r\n        group.viewers.push(uid);\r\n        const newoperations = [{\r\n                name: 'new_activity',\r\n                data: {\r\n                    by: uid,\r\n                    timestamp: +new Date(),\r\n                    entity: 'viewer',\r\n                    action: 'insert',\r\n                },\r\n            }];\r\n        const memberOfGroup = Object.keys(group.present.members).includes(uid);\r\n        // if user is not a member of group\r\n        if (!memberOfGroup) {\r\n            // if a local member is specified, convert it to the user\r\n            if (join_as && core_1.IsThisId.LocalMember(join_as)) {\r\n                newoperations.push({\r\n                    name: 'change_member_id',\r\n                    data: {\r\n                        from: join_as.toString(),\r\n                        to: uid,\r\n                    },\r\n                });\r\n            }\r\n            // otherwise join as a new member\r\n            else {\r\n                newoperations.push({\r\n                    name: 'insert_member',\r\n                    data: core_1.MemberDefault({ uid }),\r\n                });\r\n            }\r\n        }\r\n        opschain_1.ProcessServerOperations(newoperations, uid)\r\n            .forEach((op) => {\r\n            ops.operations.push(op);\r\n        });\r\n        t.update(_helpers_1.GroupsRef(id), 'viewers', group.viewers);\r\n        _helpers_1.recalculateGroupOperations(t, id, ops.operations);\r\n    });\r\n});\r\n\n\n//# sourceURL=webpack:///./src/joinGroup.ts?");

/***/ }),

/***/ "./src/publishGroup.ts":
/*!*****************************!*\
  !*** ./src/publishGroup.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst _helpers_1 = __webpack_require__(/*! ./_helpers */ \"./src/_helpers.ts\");\r\nconst opschain_1 = __webpack_require__(/*! ./utils/opschain */ \"./src/utils/opschain.ts\");\r\nconst core_1 = __webpack_require__(/*! ./utils/core */ \"./src/utils/core.ts\");\r\nexports.publishGroup = _helpers_1.f(async ({ group }, context) => {\r\n    if (!context.auth || !context.auth.uid)\r\n        throw new Error('auth_required');\r\n    const user_uid = context.auth.uid;\r\n    const id = core_1.GenerateId.OnlineGroup();\r\n    group.id = id;\r\n    group.online = true;\r\n    group.activities = (group.activities || [])\r\n        .map((act) => {\r\n        if (!act.by || act.by === 'me')\r\n            act.by = user_uid;\r\n        return act;\r\n    });\r\n    const initOperations = opschain_1.ProcessServerOperations([{\r\n            name: 'init',\r\n            data: group,\r\n            meta: {\r\n                by: user_uid,\r\n                timestamp: +new Date(),\r\n            },\r\n        }, {\r\n            name: 'change_member_id',\r\n            data: {\r\n                from: 'me',\r\n                to: user_uid,\r\n            },\r\n        }], user_uid);\r\n    const serverGroup = {\r\n        id,\r\n        present: opschain_1.Eval(initOperations),\r\n        owner: user_uid,\r\n        viewers: [user_uid],\r\n        operations: initOperations.map(i => i.hash),\r\n        options: core_1.SharedGroupOptionsDefault(),\r\n    };\r\n    const batch = _helpers_1.db.batch();\r\n    batch.set(_helpers_1.GroupsRef(id), opschain_1.omitDeep(serverGroup));\r\n    batch.set(_helpers_1.OperationsRef(id), opschain_1.omitDeep({ operations: initOperations }));\r\n    await batch.commit();\r\n    return { id };\r\n});\r\n\n\n//# sourceURL=webpack:///./src/publishGroup.ts?");

/***/ }),

/***/ "./src/removeGroup.ts":
/*!****************************!*\
  !*** ./src/removeGroup.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst _helpers_1 = __webpack_require__(/*! ./_helpers */ \"./src/_helpers.ts\");\r\nexports.removeGroup = _helpers_1.f(async (id, context) => {\r\n    if (!context.auth || !context.auth.uid)\r\n        throw new Error('auth_required');\r\n    const doc = await _helpers_1.GroupsRef(id).get();\r\n    const group = doc.data();\r\n    if (!group)\r\n        throw new Error('group_not_exists');\r\n    // TODO: verify user permission\r\n    // TODO: flag to remove, not actually deleted\r\n    await _helpers_1.GroupsRef(id).delete();\r\n    await _helpers_1.OperationsRef(id).delete();\r\n    return true;\r\n});\r\n\n\n//# sourceURL=webpack:///./src/removeGroup.ts?");

/***/ }),

/***/ "./src/uploadOperations.ts":
/*!*********************************!*\
  !*** ./src/uploadOperations.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst lodash_1 = __importDefault(__webpack_require__(/*! lodash */ \"lodash\"));\r\nconst _helpers_1 = __webpack_require__(/*! ./_helpers */ \"./src/_helpers.ts\");\r\nconst opschain_1 = __webpack_require__(/*! ./utils/opschain */ \"./src/utils/opschain.ts\");\r\nconst push_notifications_1 = __webpack_require__(/*! ./utils/push_notifications */ \"./src/utils/push_notifications.ts\");\r\nexports.uploadOperations = _helpers_1.f(async ({ id, operations, lastsync }, context) => {\r\n    if (!context.auth || !context.auth.uid)\r\n        throw new Error('auth_required');\r\n    // TODO: verify user permission\r\n    const groupid = id;\r\n    const uid = context.auth.uid;\r\n    const timestamp = +new Date();\r\n    const incomingOperations = opschain_1.ProcessServerOperations(operations, uid, timestamp);\r\n    await _helpers_1.db.runTransaction(async (t) => {\r\n        const doc = await t.get(_helpers_1.OperationsRef(id));\r\n        const serverOps = doc.data();\r\n        const ops = lodash_1.default\r\n            .chain((serverOps && serverOps.operations) || [])\r\n            .unionBy(incomingOperations, 'hash')\r\n            .sortBy('timestamp')\r\n            .value();\r\n        _helpers_1.recalculateGroupOperations(t, groupid, ops);\r\n    });\r\n    await push_notifications_1.PushGroupOperationsNotification(groupid, incomingOperations, [uid]);\r\n});\r\n\n\n//# sourceURL=webpack:///./src/uploadOperations.ts?");

/***/ }),

/***/ "./src/utils/core.ts":
/*!***************************!*\
  !*** ./src/utils/core.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nfunction __export(m) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n__export(__webpack_require__(/*! ../../../../core */ \"../../core/index.ts\"));\r\n\n\n//# sourceURL=webpack:///./src/utils/core.ts?");

/***/ }),

/***/ "./src/utils/opschain.ts":
/*!*******************************!*\
  !*** ./src/utils/opschain.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n// @ts-ignore\r\nconst js_cache_1 = __importDefault(__webpack_require__(/*! js-cache */ \"js-cache\"));\r\nconst core_1 = __webpack_require__(/*! ./core */ \"./src/utils/core.ts\");\r\nconst transformCache = new js_cache_1.default();\r\nconst transformCacheTTL = 10 * 24 * 60 * 60 * 1000; // 10 days\r\n// warpper functions\r\nfunction ProcessServerOperations(operations, uid, server_timestamp) {\r\n    return core_1.ProcessOperations(operations).map((o) => {\r\n        return Object.assign({}, o, { uid, server_timestamp: server_timestamp || +new Date() });\r\n    });\r\n}\r\nexports.ProcessServerOperations = ProcessServerOperations;\r\nconst _eval = core_1.EvalTransforms(core_1.Transforms, {\r\n    cacheObject: transformCache,\r\n    cacheTTL: transformCacheTTL,\r\n    shouldCache: (operation) => {\r\n        // skip caches that is too old\r\n        return operation.timestamp + transformCacheTTL > +new Date();\r\n    },\r\n});\r\nfunction Eval(operations) {\r\n    const base = core_1.GroupDefault();\r\n    return _eval(base, operations);\r\n}\r\nexports.Eval = Eval;\r\nfunction omitDeep(data) {\r\n    return JSON.parse(JSON.stringify(data));\r\n}\r\nexports.omitDeep = omitDeep;\r\n\n\n//# sourceURL=webpack:///./src/utils/opschain.ts?");

/***/ }),

/***/ "./src/utils/push_notifications.ts":
/*!*****************************************!*\
  !*** ./src/utils/push_notifications.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importStar = (this && this.__importStar) || function (mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\r\n    result[\"default\"] = mod;\r\n    return result;\r\n};\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst admin = __importStar(__webpack_require__(/*! firebase-admin */ \"firebase-admin\"));\r\nconst lodash_1 = __importDefault(__webpack_require__(/*! lodash */ \"lodash\"));\r\nconst core_1 = __webpack_require__(/*! ./core */ \"./src/utils/core.ts\");\r\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/utils/utils.ts\");\r\nconst opschain_1 = __webpack_require__(/*! ./opschain */ \"./src/utils/opschain.ts\");\r\nconst GroupsRef = (id) => admin.firestore().collection('groups').doc(id);\r\nconst MessageTokensRef = (id) => admin.firestore().collection('messaging_tokens').doc(id);\r\nconst UserInfoRef = (id) => admin.firestore().collection('users').doc(id);\r\nasync function GetMessagingTokens(uids) {\r\n    const tasks = uids.map(async (uid) => {\r\n        const tokenDoc = await MessageTokensRef(uid).get();\r\n        if (!tokenDoc.exists)\r\n            return [];\r\n        const data = tokenDoc.data();\r\n        if (!data || !data.tokens)\r\n            return [];\r\n        return data.tokens.map((t) => {\r\n            t.uid = uid;\r\n            return t;\r\n        });\r\n    });\r\n    return lodash_1.default.flatten(await Promise.all(tasks)).filter(t => t.enabled);\r\n}\r\nexports.GetMessagingTokens = GetMessagingTokens;\r\nasync function GetUserInfos(uids) {\r\n    const tasks = uids.map(async (uid) => {\r\n        const doc = await UserInfoRef(uid).get();\r\n        if (!doc.exists)\r\n            return null;\r\n        const data = doc.data();\r\n        return data;\r\n    });\r\n    const users = await Promise.all(tasks);\r\n    const info = {};\r\n    for (const user of users) {\r\n        if (user && user.uid)\r\n            info[user.uid] = user;\r\n    }\r\n    return info;\r\n}\r\nexports.GetUserInfos = GetUserInfos;\r\nasync function PushGroupOperationsNotification(groupid, operations, excludesIds) {\r\n    const groupDoc = await GroupsRef(groupid).get();\r\n    const group = groupDoc.data();\r\n    const viewers = group.viewers;\r\n    const receivers = lodash_1.default.without(viewers, ...excludesIds);\r\n    const receiversTokens = await GetMessagingTokens(receivers);\r\n    const users = {};\r\n    const getUserInfo = async (uid) => {\r\n        if (users[uid])\r\n            return users[uid];\r\n        const doc = await UserInfoRef(uid).get();\r\n        if (!doc.exists)\r\n            return undefined;\r\n        const user = doc.data();\r\n        users[uid] = user;\r\n        return user;\r\n    };\r\n    const messages = [];\r\n    for (const op of operations) {\r\n        if (op.name === 'insert_transaction') {\r\n            const data = opschain_1.Eval([op]);\r\n            const act = data.activities[0];\r\n            if (!act)\r\n                continue;\r\n            for (const token of receiversTokens) {\r\n                const user = await getUserInfo(act.by);\r\n                const username = user && user.name;\r\n                const description = core_1.getActivityDescription(utils_1.t, act, token.locale, username, true);\r\n                const groupname = group.present.name;\r\n                messages.push({\r\n                    notification: {\r\n                        title: description,\r\n                        body: groupname,\r\n                    },\r\n                    token: token.token,\r\n                });\r\n            }\r\n        }\r\n    }\r\n    if (!messages.length)\r\n        return 0;\r\n    await admin.messaging().sendAll(messages);\r\n    return messages.length;\r\n}\r\nexports.PushGroupOperationsNotification = PushGroupOperationsNotification;\r\n\n\n//# sourceURL=webpack:///./src/utils/push_notifications.ts?");

/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nfunction __export(m) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n__export(__webpack_require__(/*! ../../../../utils */ \"../../utils/index.ts\"));\r\n\n\n//# sourceURL=webpack:///./src/utils/utils.ts?");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"axios\");\n\n//# sourceURL=webpack:///external_%22axios%22?");

/***/ }),

/***/ "dayjs":
/*!************************!*\
  !*** external "dayjs" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dayjs\");\n\n//# sourceURL=webpack:///external_%22dayjs%22?");

/***/ }),

/***/ "dayjs/locale/en":
/*!**********************************!*\
  !*** external "dayjs/locale/en" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dayjs/locale/en\");\n\n//# sourceURL=webpack:///external_%22dayjs/locale/en%22?");

/***/ }),

/***/ "dayjs/locale/fr":
/*!**********************************!*\
  !*** external "dayjs/locale/fr" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dayjs/locale/fr\");\n\n//# sourceURL=webpack:///external_%22dayjs/locale/fr%22?");

/***/ }),

/***/ "dayjs/locale/ja":
/*!**********************************!*\
  !*** external "dayjs/locale/ja" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dayjs/locale/ja\");\n\n//# sourceURL=webpack:///external_%22dayjs/locale/ja%22?");

/***/ }),

/***/ "dayjs/locale/zh-cn":
/*!*************************************!*\
  !*** external "dayjs/locale/zh-cn" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dayjs/locale/zh-cn\");\n\n//# sourceURL=webpack:///external_%22dayjs/locale/zh-cn%22?");

/***/ }),

/***/ "dayjs/locale/zh-tw":
/*!*************************************!*\
  !*** external "dayjs/locale/zh-tw" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dayjs/locale/zh-tw\");\n\n//# sourceURL=webpack:///external_%22dayjs/locale/zh-tw%22?");

/***/ }),

/***/ "dayjs/plugin/localizedFormat":
/*!***********************************************!*\
  !*** external "dayjs/plugin/localizedFormat" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dayjs/plugin/localizedFormat\");\n\n//# sourceURL=webpack:///external_%22dayjs/plugin/localizedFormat%22?");

/***/ }),

/***/ "dayjs/plugin/relativeTime":
/*!********************************************!*\
  !*** external "dayjs/plugin/relativeTime" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dayjs/plugin/relativeTime\");\n\n//# sourceURL=webpack:///external_%22dayjs/plugin/relativeTime%22?");

/***/ }),

/***/ "firebase-admin":
/*!*********************************!*\
  !*** external "firebase-admin" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"firebase-admin\");\n\n//# sourceURL=webpack:///external_%22firebase-admin%22?");

/***/ }),

/***/ "firebase-functions":
/*!*************************************!*\
  !*** external "firebase-functions" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"firebase-functions\");\n\n//# sourceURL=webpack:///external_%22firebase-functions%22?");

/***/ }),

/***/ "fraction.js":
/*!******************************!*\
  !*** external "fraction.js" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fraction.js\");\n\n//# sourceURL=webpack:///external_%22fraction.js%22?");

/***/ }),

/***/ "js-cache":
/*!***************************!*\
  !*** external "js-cache" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"js-cache\");\n\n//# sourceURL=webpack:///external_%22js-cache%22?");

/***/ }),

/***/ "json-stable-stringify":
/*!****************************************!*\
  !*** external "json-stable-stringify" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"json-stable-stringify\");\n\n//# sourceURL=webpack:///external_%22json-stable-stringify%22?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash\");\n\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ }),

/***/ "lodash/cloneDeep":
/*!***********************************!*\
  !*** external "lodash/cloneDeep" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash/cloneDeep\");\n\n//# sourceURL=webpack:///external_%22lodash/cloneDeep%22?");

/***/ }),

/***/ "lodash/concat":
/*!********************************!*\
  !*** external "lodash/concat" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash/concat\");\n\n//# sourceURL=webpack:///external_%22lodash/concat%22?");

/***/ }),

/***/ "lodash/find":
/*!******************************!*\
  !*** external "lodash/find" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash/find\");\n\n//# sourceURL=webpack:///external_%22lodash/find%22?");

/***/ }),

/***/ "lodash/get":
/*!*****************************!*\
  !*** external "lodash/get" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash/get\");\n\n//# sourceURL=webpack:///external_%22lodash/get%22?");

/***/ }),

/***/ "lodash/map":
/*!*****************************!*\
  !*** external "lodash/map" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash/map\");\n\n//# sourceURL=webpack:///external_%22lodash/map%22?");

/***/ }),

/***/ "lodash/mapValues":
/*!***********************************!*\
  !*** external "lodash/mapValues" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash/mapValues\");\n\n//# sourceURL=webpack:///external_%22lodash/mapValues%22?");

/***/ }),

/***/ "lodash/merge":
/*!*******************************!*\
  !*** external "lodash/merge" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash/merge\");\n\n//# sourceURL=webpack:///external_%22lodash/merge%22?");

/***/ }),

/***/ "lodash/sumBy":
/*!*******************************!*\
  !*** external "lodash/sumBy" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash/sumBy\");\n\n//# sourceURL=webpack:///external_%22lodash/sumBy%22?");

/***/ }),

/***/ "lodash/uniq":
/*!******************************!*\
  !*** external "lodash/uniq" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash/uniq\");\n\n//# sourceURL=webpack:///external_%22lodash/uniq%22?");

/***/ }),

/***/ "nanoid":
/*!*************************!*\
  !*** external "nanoid" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"nanoid\");\n\n//# sourceURL=webpack:///external_%22nanoid%22?");

/***/ }),

/***/ "rusha":
/*!************************!*\
  !*** external "rusha" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"rusha\");\n\n//# sourceURL=webpack:///external_%22rusha%22?");

/***/ })

/******/ })));
