export const auth = {
  Authorization: `Bearer ${localStorage?.getItem("token")}`,
};
export const api_url = "http://127.0.0.1:3000/graphql";
