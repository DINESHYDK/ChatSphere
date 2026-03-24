export function VERIFY_API_LIMIT(last_updation_time) {
  let max_allowed_time =
    process.env.MAX_RESEND_API_ALLOWED_TIME || 2 * 60 * 60 * 1000;
  return Date.now() - last_updation_time.getTime() > max_allowed_time;
}
