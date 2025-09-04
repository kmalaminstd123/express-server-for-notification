// getting user token and notification token
async function getUserandNotificationToken(student_id, user_token, notification_token) {
  try {
    const res = await fetch(`https://mba-edu.uk/api/v1/notificationtoken/${student_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": user_token,
      },
    });

    const result = await res.json();

    if (result.success) {
      const token = result.tokens[0];

      if (!token?.notification_token || !token?.user_token) {
        const registerRes = await registerUserAndNotificationToken(
          student_id,
          user_token,
          notification_token
        );
        return registerRes; // 👈 return something meaningful
      }

      return true; // tokens already exist
    }

    return false; // API returned success: false
  } catch (err) {
    console.log("getUserandNotificationToken error:", err);
    return false;
  }
}



// registering user token and notification token
async function registerUserAndNotificationToken(student_id, user_token, notification_token) {
  try {
    const res = await fetch(`https://mba-edu.uk/api/v1/notificationtoken/${student_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": user_token,
      },
      body: JSON.stringify({
        notification_token,
        user_token,
      }),
    });

    const result = await res.json();
    console.log("Register result:", result);
    return result; // 👈 return response object
  } catch (err) {
    console.log("registerUserAndNotificationToken error:", err);
    return { success: false };
  }
}



async function checkAuth(req, res, next) {
  try {
    const { student_id, user_token, notification_token } = req.headers;

    const tokenRes = await getUserandNotificationToken(
      student_id,
      user_token,
      notification_token
    );

    // console.log("Token check result:", tokenRes);

    if (tokenRes) {
      return next();
    } else {
      return res.status(401).json({
        status: false,
        message: "You are not authorized",
      });
    }
  } catch (err) {
    console.error("Auth check error:", err);
    return res.status(500).json({
      status: false,
      message: "Server error in checkAuth",
    });
  }
}


module.exports = checkAuth