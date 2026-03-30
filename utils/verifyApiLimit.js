export function VERIFY_API_LIMIT(last_updation_time) {
  let max_allowed_time = process.env.MAX_RESEND_API_ALLOWED_TIME || "7200000";
  return (
    Date.now() - last_updation_time.getTime() > parseInt(max_allowed_time, 10)
  );
}
