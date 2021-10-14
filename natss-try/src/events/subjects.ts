
// for using Subjects as a type with limited values,
// so that TS would check it, preventing typos.
export enum Subjects {
  TicketCreated = 'ticket:created',   // it is an attribute in js but also a type in ts.
  OrderUpdated = 'order:updated'
}

