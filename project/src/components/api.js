
const response = await fetch("https://educapi-v2.onrender.com/card", {
  method: "GET",
  headers : {
    "usersecretpasskey" : "Edwa735923IA"
  }
  body: JSON.stringify({ username: "example" }),
  // …
});