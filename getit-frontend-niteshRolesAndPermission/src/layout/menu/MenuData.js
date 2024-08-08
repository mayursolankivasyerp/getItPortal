const menu = [
  {
    icon: "dashboard-fill",
    text: "Dashboards",
    active: false,
    link: "/",
  },

  {
    icon: "ticket",
    text: "Ticker Management",
    active: false,
    subMenu: [
      {
        text: "Ticket Lists",
        link: "/ticket-lists-default",
      },
    ],
  },

  {
    icon: "tile-thumb-fill",
    text: "TicketTypes",
    active: false,
    subMenu: [
      {
        text: "TicketTypes List",
        link: "/ticketTypeList",
      },
    ],
  },
];
export default menu;
