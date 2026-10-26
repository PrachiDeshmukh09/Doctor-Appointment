
const API_URL = "http://localhost:3001";
async function getData(url) {
  const response = await fetch(API_URL + url);

  if (!response.ok) {
    throw new Error("Data fetch nahi hua");
  }

  return response.json();
}

async function postData(url, data) {
  const response = await fetch(API_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Data save nahi hua");
  }

  return response.json();
}

async function updateData(url, data) {
  const response = await fetch(API_URL + url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Data update nahi hua");
  }

  return response.json();
}

async function deleteData(url) {
  const response = await fetch(API_URL + url, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Data delete nahi hua");
  }
}

export const api = {
  getDoctors(search = "", specialty = "All") {
    let url = "/doctors";
    const params = new URLSearchParams();

    if (search.trim()) {
      params.append("q", search.trim());
    }

    if (specialty !== "All") {
      params.append("specialty", specialty);
    }

    if (params.toString()) {
      url += "?" + params.toString();
    }

    return getData(url);
  },

  getAppointments() {
    return getData("/appointments");
  },

  createAppointment(appointment) {
    return postData("/appointments", appointment);
  },

  updateAppointment(id, updates) {
    return updateData("/appointments/" + id, updates);
  },

  getBlockedSlots() {
    return getData("/blockedSlots");
  },

  createBlockedSlot(slot) {
    return postData("/blockedSlots", slot);
  },

  deleteBlockedSlot(id) {
    return deleteData("/blockedSlots/" + id);
  }
};
