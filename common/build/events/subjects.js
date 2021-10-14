"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subjects = void 0;
// for using Subjects as a type with limited values,
// so that TS would check it, preventing typos.
var Subjects;
(function (Subjects) {
    Subjects["TicketCreated"] = "ticket:created";
    Subjects["TicketUpdated"] = "ticket:updated";
    Subjects["OrderCreated"] = "order:created";
    Subjects["OrderCancelled"] = "order:cancelled";
    Subjects["ExpirationComplete"] = "expiration:complete";
    Subjects["PaymentCreated"] = "payment:created";
})(Subjects = exports.Subjects || (exports.Subjects = {}));
