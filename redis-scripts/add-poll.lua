local poll_name = KEYS[1]; --poll_123_votes --> stores no of votes for each option
local poll_id = KEYS[2];
local total_option = tonumber(ARGV[1]);
local poll_gender = ARGV[2];

if not KEYS[1] or not KEYS[2] or not total_option or not ARGV[2] then
  return '{"status":"400", "message":"MISSING_KEY_OR_ARGUMENT"}'
end

if total_option > 6 then
  return '{"status":"400", "message":"INVALID_REQUEST"}'
end
for i = 0, total_option - 1, 1 do
  redis.call("HSET", poll_name, i, 0);
end

redis.call("HSET", "poll_metadata", poll_id, poll_gender);

return '{"status":"200", "message":"SUCCESS"}';
