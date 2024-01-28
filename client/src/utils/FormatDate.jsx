function formatDate(inputDateStr) {
  var inputDate = new Date(inputDateStr);
  var options = { day: "numeric", month: "short", year: "numeric" };
  var outputDateStr = inputDate.toLocaleDateString("en-US", options);
  return outputDateStr;
}

export default formatDate;
