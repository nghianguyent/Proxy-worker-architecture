CREATE OR REPLACE FUNCTION uuid_generate_v7()
RETURNS uuid
AS $$
DECLARE
  v_time timestamp with time zone := null;
  v_ms bigint := null;
  v_uuid_bytes bytea := null;
  v_random_bytes bytea := null;
BEGIN
  -- 1. Get current timestamp with high precision
  v_time := clock_timestamp();

  -- 2. Convert timestamp to milliseconds since Epoch
  v_ms := (EXTRACT(EPOCH FROM v_time) * 1000)::bigint;

  -- 3. Generate 10 bytes of randomness
  v_random_bytes := gen_random_bytes(10);

  -- 4. Construct the UUID byte array
  v_uuid_bytes :=
    decode(lpad(to_hex(v_ms), 12, '0'), 'hex') ||
    v_random_bytes;

  -- 5. Set Version 7 (0111)
  v_uuid_bytes := set_byte(
    v_uuid_bytes,
    6,
    (get_byte(v_uuid_bytes, 6) & 15) | 112
  );

  -- 6. Set Variant (10xx)
  v_uuid_bytes := set_byte(
    v_uuid_bytes,
    8,
    (get_byte(v_uuid_bytes, 8) & 63) | 128
  );

  RETURN encode(v_uuid_bytes, 'hex')::uuid;
END;
$$ LANGUAGE plpgsql VOLATILE PARALLEL SAFE;