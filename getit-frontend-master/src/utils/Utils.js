// //url for production
// export var url = "";
// if (process.env.NODE_ENV === "development") {
//   url = "";
// } else {
//   url = window.location.host.split("/")[1];
//   if (url) {
//     url = `/${window.location.host.split("/")[1]}`;
//   } else url = process.env.PUBLIC_URL; /// ADD YOUR CPANEL SUB-URL
// }

// //Function to validate and return errors for a form
// export const checkForm = (formData) => {
//   let errorState = {};
//   Object.keys(formData).forEach((item) => {
//     if (formData[item] === null || formData[item] === "") {
//       errorState[item] = "This field is required";
//     }
//   });
//   return errorState;
// };

// //Function that returns the formatted date and formatted time
// export const formatDateAndTime = (dateString) => {
//   const dateObj = new Date(dateString);
//   const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getFullYear()}`;
//   const hours = dateObj.getHours();
//   const minutes = dateObj.getMinutes();
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   const formattedTime = `${(hours % 12) || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
//   return { formattedDate, formattedTime };
// }

// //Function that returns the first or first two letters from a name
// export const findUpper = (string) => {
//   let extractedString = [];

//   for (var i = 0; i < string?.length; i++) {
//     if (string.charAt(i) === string.charAt(i).toUpperCase() && string.charAt(i) !== " ") {
//       extractedString.push(string.charAt(i));
//     }
//   }
//   if (extractedString.length > 1) {
//     return extractedString[0] + extractedString[1];
//   } else {
//     return extractedString[0];
//   }
// };

// //Function that calculates the from current date
// export const setDeadline = (days) => {
//   let todayDate = new Date();
//   var newDate = new Date(todayDate);
//   newDate.setDate(newDate.getDate() + days);
//   return newDate;
// };

// // Function to set deadline for projects
// export const setDeadlineDays = (deadline) => {
//   var currentDate = new Date();
//   var difference = deadline.getTime() - currentDate.getTime();
//   var days = Math.ceil(difference / (1000 * 3600 * 24));
//   return days;
// };

// //Date formatter function
// export const dateFormatterAlt = (date, reverse) => {
//   let d = date.getDate();
//   let m = date.getMonth();
//   let y = date.getFullYear();
//   reverse ? (date = m + "-" + d + "-" + y) : (date = y + "-" + d + "-" + m);
//   return date;
// };

// //Date formatter function
// export const dateFormatter = (date, reverse) => {
//   var dateformat = date.split("-");
//   //var date = dateformat[1]+"-"+dateformat[2]+"-"+dateformat[0];
//   reverse
//     ? (date = dateformat[2] + "-" + dateformat[0] + "-" + dateformat[1])
//     : (date = dateformat[1] + "-" + dateformat[2] + "-" + dateformat[0]);
//   return date;
// };

// //Month Names
// export const monthNames = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// //todays Date
// export const todaysDate = new Date();

// // Function to structure date ex : Jun 4, 2011;
// export const getDateStructured = (date) => {
//   let d = date.getDate();
//   let m = date.getMonth();
//   let y = date.getFullYear();
//   let final = monthNames[m] + " " + d + ", " + y;
//   return final;
// };

// // Function to structure date ex: YYYY-MM-DD
// export const setDateForPicker = (rdate) => {
//   let d = rdate.getDate();
//   d < 10 && (d = "0" + d);
//   let m = rdate.getMonth() + 1;
//   m < 10 && (m = "0" + m);
//   let y = rdate.getFullYear();
//   rdate = y + "-" + m + "-" + d;

//   return rdate;
// };

// //current Time
// export const currentTime = () => {
//   var hours = todaysDate.getHours();
//   var minutes = todaysDate.getMinutes();
//   var ampm = hours >= 12 ? "PM" : "AM";
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? "0" + minutes : minutes;
//   var strTime = hours + ":" + minutes + " " + ampm;
//   return strTime;
// };

// //Percentage calculation
// export const calcPercentage = (str1, str2) => {
//   let result = Number(str2) / Number(str1);
//   result = result * 100;
//   return Math.floor(result);
// };

// //shortens a long string
// export const truncate = (str, n) => {
//   return str.length > n ? str.substr(0, n - 1) + " " + truncate(str.substr(n - 1, str.length), n) : str;
// };

// // returns upload url
// export const getUploadParams = () => {
//   return { url: "https://httpbin.org/post" };
// };

// // Converts KB to MB
// export const bytesToMegaBytes = (bytes) => {
//   let result = bytes / (1024 * 1024);
//   return result.toFixed(2);
// };

// export const bulkActionOptions = [
//   { value: "suspend", label: "Suspend User" },
//   { value: "delete", label: "Delete User" },
// ];



// // Function to restructure date & time format
// export const formatDate =(inputDate)=> {
//   // Split the input date into date and time parts
//   const [datePart, timePart] = inputDate.split(' ');

//   // Split the date part into day, month, and year
//   const [day, month, year] = datePart.split('/');

//   // Split the time part into hours, minutes, and seconds
//   const [hours, minutes, seconds] = timePart.split(':');

//   // Create a new Date object
//   // Note: Months are 0-indexed in JavaScript, so subtract 1 from the month
//   const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);

//   // Format the date
//   const options = {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   };

//   return parsedDate.toLocaleString("en-US", options);
// }

// // Function to capitalize text
// export const capitalizeName = (name) => {
//   // Split the name into words based on spaces
//   const words = name.split(' ');

//   // Capitalize the first letter of each word and make the rest lowercase
//   const capitalizedWords = words.map(word => {
//     return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//   });

//   // Join the capitalized words back together with a space
//   return capitalizedWords.join(' ');
// }