export function VERIFY_API_LIMIT(last_updation_time) {
  let max_allowed_time = 2 * 60 * 60 * 1000; // *** 2 Hrs ***
  return Date.now() - last_updation_time.getTime() > max_allowed_time;
}
