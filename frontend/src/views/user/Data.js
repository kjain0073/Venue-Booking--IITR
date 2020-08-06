// myBookings
export let myBookings=[]

export const setBookingData = (data) => {
  myBookings=data;
}

export const getBookingData=() => {
  return myBookings;
}