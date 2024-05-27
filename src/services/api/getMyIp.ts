export const getMyIp = async () => {
  let ipAddress;
  await fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      ipAddress = data.ip;
    });

  return ipAddress;
};
