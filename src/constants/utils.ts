export const auth = {
  Authorization: `Bearer ${
    typeof window !== "undefined" && localStorage?.getItem("token")
  }`,
};
export const api_url = "http://127.0.0.1:3000/graphql";
