// doc: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#pragmastring-options---results
import Database from 'better-sqlite3'
const db = new Database('prod.db', { verbose: console.log })

db.pragma('journal_mode = WAL')
db.pragma('synchronous = NORMAL')

// db schema
db.exec(`
  CREATE TABLE IF NOT EXISTS com_code_grp (
    grp_cd  TEXT PRIMARY KEY,
    grp_nm  TEXT NOT NULL,
    use_yn  TEXT DEFAULT 'N',
    ord     INTEGER DEFAULT 0,
    crt_dt  DATETIME DEFAULT CURRENT_TIMESTAMP,
    crt_usr INTEGER,
    upd_dt  DATETIME,
    upd_usr INTEGER
  );
  `)

db.exec(`
CREATE TABLE IF NOT EXISTS com_code_itm (
  grp_cd  TEXT NOT NULL REFERENCES com_code_grp(grp_cd),
  itm_cd  TEXT NOT NULL,
  itm_nm  TEXT NOT NULL,
  attr1   TEXT,
  attr2   TEXT,
  use_yn  TEXT DEFAULT 'N',
  ord     INTEGER DEFAULT 0,
  crt_dt  DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr INTEGER,
  upd_dt  DATETIME,
  upd_usr INTEGER,
  PRIMARY KEY (grp_cd, itm_cd)
);
`)

db.exec(`
CREATE INDEX IF NOT EXISTS idx_code_itm_grp_ord
  ON com_code_itm (grp_cd, ord);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS store (
  store_id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_nm TEXT NOT NULL,
  tel      TEXT,
  addr     TEXT,
  timezone TEXT DEFAULT 'Asia/Seoul',
  use_yn   TEXT DEFAULT 'Y',
  crt_dt   DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr  INTEGER,
  upd_dt   DATETIME,
  upd_usr  INTEGER
);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS store_zone (
  zone_id       INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id      INTEGER NOT NULL REFERENCES store(store_id),
  zone_nm       TEXT NOT NULL,
  floor_label   TEXT,
  use_yn        TEXT DEFAULT 'Y',
  crt_dt        DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr       INTEGER,
  upd_dt        DATETIME,
  upd_usr       INTEGER,
  active_map_id INTEGER,
  FOREIGN KEY (active_map_id) REFERENCES store_zone_map(map_id)
);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS store_zone_map (
  map_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  zone_id    INTEGER NOT NULL REFERENCES store_zone(zone_id),
  image_url  TEXT NOT NULL,
  width_px   INTEGER NOT NULL,
  height_px  INTEGER NOT NULL,
  scale_hint REAL,
  checksum   TEXT,
  is_active  INTEGER DEFAULT 0,      -- 0=false, 1=true
  ver_no     INTEGER NOT NULL DEFAULT 1,
  crt_dt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr    INTEGER,
  upd_dt     DATETIME,
  upd_usr    INTEGER
);
`)

db.exec(`
-- 존(zone)별 활성 맵은 1개만: 부분(Partial) 고유 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS uq_zone_active_map
  ON store_zone_map (zone_id)
  WHERE is_active = 1;
`)

db.exec(`
CREATE TABLE IF NOT EXISTS device_profile (
  profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT,
  width_px   INTEGER NOT NULL,
  height_px  INTEGER NOT NULL,
  dpi        INTEGER,
  desc_txt   TEXT,
  crt_dt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr    INTEGER,
  upd_dt     DATETIME,
  upd_usr    INTEGER
);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS device (
  device_id  TEXT PRIMARY KEY,
  store_id   INTEGER NOT NULL REFERENCES store(store_id),
  profile_id INTEGER REFERENCES device_profile(profile_id),
  serial     TEXT UNIQUE,
  kiosk_name TEXT,
  active     INTEGER DEFAULT 1,       -- 1=true
  crt_dt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr    INTEGER,
  upd_dt     DATETIME,
  upd_usr    INTEGER
);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS member (
  member_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  home_store_id INTEGER REFERENCES store(store_id),
  phone_hash    TEXT NOT NULL UNIQUE,
  phone_last4   TEXT NOT NULL,
  name_mask     TEXT,
  crt_dt        DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr       INTEGER,
  upd_dt        DATETIME,
  upd_usr       INTEGER
);
`)

db.exec(`
CREATE INDEX IF NOT EXISTS idx_member_last4
  ON member (phone_last4);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS member_store (
  member_id INTEGER NOT NULL REFERENCES member(member_id),
  store_id  INTEGER NOT NULL REFERENCES store(store_id),
  scope_cd  TEXT NOT NULL DEFAULT 'ALLOW',
  note      TEXT,
  crt_dt    DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr   INTEGER,
  upd_dt    DATETIME,
  upd_usr   INTEGER,
  PRIMARY KEY (member_id, store_id)
);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS pass_price (
  price_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  prod_id       INTEGER NOT NULL,
  amount        REAL    NOT NULL,
  time_min      INTEGER,
  valid_days    INTEGER,
  period_days   INTEGER,
  daily_cap_min INTEGER,
  eff_from      DATE DEFAULT CURRENT_DATE NOT NULL,
  eff_to        DATE,
  use_yn        TEXT DEFAULT 'Y',
  ord           INTEGER DEFAULT 0,
  crt_dt        DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr       INTEGER,
  upd_dt        DATETIME,
  upd_usr       INTEGER,
  CHECK (
    (time_min IS NOT NULL AND valid_days IS NULL AND period_days IS NULL) OR
    (time_min IS NULL AND valid_days IS NOT NULL AND period_days IS NULL) OR
    (time_min IS NULL AND valid_days IS NULL AND period_days IS NOT NULL)
  )
);
`)

db.exec(`
CREATE INDEX IF NOT EXISTS idx_price_prod
  ON pass_price (prod_id, use_yn, eff_from);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS member_pass (
  mpass_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id  INTEGER NOT NULL REFERENCES member(member_id),
  store_id   INTEGER REFERENCES store(store_id),
  pass_typ   TEXT    NOT NULL CHECK (pass_typ IN ('TIME','DAY','MEMBERSHIP')),
  status_cd  TEXT    NOT NULL DEFAULT 'ACTIVE',
  prod_id    INTEGER NOT NULL,
  price_id   INTEGER NOT NULL REFERENCES pass_price(price_id),
  scope_cd   TEXT DEFAULT 'ANY',
  remain_min INTEGER,
  day_date   DATE,
  start_dt   DATETIME,
  end_dt     DATETIME,
  crt_dt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr    INTEGER,
  upd_dt     DATETIME,
  upd_usr    INTEGER
);
`)

db.exec(`
CREATE INDEX IF NOT EXISTS idx_mpass_member
  ON member_pass (member_id, pass_typ, status_cd);
`)
db.exec(`
CREATE INDEX IF NOT EXISTS idx_mpass_store
  ON member_pass (store_id, status_cd);
`)
db.exec(`
CREATE INDEX IF NOT EXISTS idx_mpass_day
  ON member_pass (day_date);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS seat_sess (
  sess_id    INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id   INTEGER REFERENCES store(store_id),
  device_id  TEXT    REFERENCES device(device_id),
  seat_id    INTEGER NOT NULL,
  member_id  INTEGER NOT NULL REFERENCES member(member_id),
  mpass_id   INTEGER NOT NULL REFERENCES member_pass(mpass_id),
  pass_typ   TEXT    NOT NULL,
  status_cd  TEXT    NOT NULL DEFAULT 'ACTIVE',
  chk_in_dt  DATETIME NOT NULL,
  chk_out_dt DATETIME,
  expire_dt  DATETIME,
  used_min   INTEGER,
  crt_dt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr    INTEGER,
  upd_dt     DATETIME,
  upd_usr    INTEGER
);
`)

db.exec(`
CREATE INDEX IF NOT EXISTS idx_sess_store_status
  ON seat_sess (store_id, status_cd, chk_in_dt);
`)
db.exec(`
CREATE INDEX IF NOT EXISTS idx_sess_expire
  ON seat_sess (expire_dt);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS orders (
  order_id  INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id  INTEGER REFERENCES store(store_id),
  device_id TEXT REFERENCES device(device_id),
  order_typ TEXT NOT NULL DEFAULT 'PASS',
  status_cd TEXT NOT NULL DEFAULT 'NEW',
  member_id INTEGER REFERENCES member(member_id),
  sess_id   INTEGER REFERENCES seat_sess(sess_id),
  amount    REAL NOT NULL,
  discount  REAL NOT NULL DEFAULT 0,
  ord_dt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  crt_dt    DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr   INTEGER,
  upd_dt    DATETIME,
  upd_usr   INTEGER
);
`)

db.exec(`
CREATE INDEX IF NOT EXISTS idx_orders_store_status
  ON orders (store_id, status_cd, ord_dt);
`)
db.exec(`
CREATE INDEX IF NOT EXISTS idx_orders_sess
  ON orders (sess_id);
`)
db.exec(`
CREATE INDEX IF NOT EXISTS idx_orders_member
  ON orders (member_id, status_cd);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS order_item (
  order_id INTEGER NOT NULL REFERENCES orders(order_id),
  line_no  INTEGER NOT NULL,
  prod_id  INTEGER NOT NULL,
  price_id INTEGER NOT NULL REFERENCES pass_price(price_id),
  qty      INTEGER NOT NULL DEFAULT 1,
  amount   REAL    NOT NULL,
  mpass_id INTEGER REFERENCES member_pass(mpass_id),
  crt_dt   DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr  INTEGER,
  upd_dt   DATETIME,
  upd_usr  INTEGER,
  PRIMARY KEY (order_id, line_no)
);
`)

db.exec(`
CREATE INDEX IF NOT EXISTS idx_orderitem_prod
  ON order_item (prod_id, price_id);
`)
db.exec(`
CREATE INDEX IF NOT EXISTS idx_orderitem_mpass
  ON order_item (mpass_id);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS payment (
  pay_id       INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id     INTEGER NOT NULL REFERENCES orders(order_id),
  method       TEXT    NOT NULL,
  approved     INTEGER NOT NULL DEFAULT 0,  -- 0/1
  status_cd    TEXT,
  pay_dt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approve_dt   DATETIME,
  van_tx_id    TEXT,
  receipt_json TEXT,                        -- JSON 문자열 저장
  crt_dt       DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr      INTEGER,
  upd_dt       DATETIME,
  upd_usr      INTEGER
);
`)

db.exec(`
CREATE INDEX IF NOT EXISTS idx_payment_order
  ON payment (order_id);
`)
db.exec(`
CREATE INDEX IF NOT EXISTS idx_payment_pay_dt
  ON payment (pay_dt);
`)
db.exec(`
CREATE INDEX IF NOT EXISTS idx_payment_approve_dt
  ON payment (approve_dt);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS admin_user (
  admin_id       INTEGER PRIMARY KEY AUTOINCREMENT,
  login_id       TEXT NOT NULL UNIQUE,
  login_pw       TEXT NOT NULL,
  name           TEXT NOT NULL,
  is_super_admin INTEGER DEFAULT 0,          -- 0/1
  status_cd      TEXT NOT NULL DEFAULT 'ACTIVE',
  last_login     DATETIME,
  crt_dt         DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr        INTEGER,
  upd_dt         DATETIME,
  upd_usr        INTEGER
);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS admin_role (
  role_cd  TEXT PRIMARY KEY,
  role_nm  TEXT NOT NULL,
  desc_txt TEXT,
  crt_dt   DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr  INTEGER,
  upd_dt   DATETIME,
  upd_usr  INTEGER
);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS admin_user_role (
  admin_id INTEGER NOT NULL REFERENCES admin_user(admin_id),
  role_cd  TEXT    NOT NULL REFERENCES admin_role(role_cd),
  crt_dt   DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr  INTEGER,
  upd_dt   DATETIME,
  upd_usr  INTEGER,
  PRIMARY KEY (admin_id, role_cd)
);
`)

db.exec(`
CREATE INDEX IF NOT EXISTS idx_admin_user_role_admin
  ON admin_user_role (admin_id);
`)
db.exec(`
CREATE INDEX IF NOT EXISTS idx_admin_user_role_role
  ON admin_user_role (role_cd);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS admin_user_store (
  admin_id INTEGER NOT NULL REFERENCES admin_user(admin_id),
  store_id INTEGER NOT NULL REFERENCES store(store_id),
  role_cd  TEXT    NOT NULL REFERENCES admin_role(role_cd),
  crt_dt   DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr  INTEGER,
  upd_dt   DATETIME,
  upd_usr  INTEGER,
  PRIMARY KEY (admin_id, store_id)
);
`)

db.exec(`
CREATE INDEX IF NOT EXISTS idx_admin_user_store_role
  ON admin_user_store (role_cd);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS pass_product (
  prod_id    INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id   INTEGER REFERENCES store(store_id),
  pass_typ   TEXT    NOT NULL,
  prod_nm    TEXT    NOT NULL,
  alias_nm   TEXT,
  desc_txt   TEXT,
  alias_desc TEXT,
  use_yn     TEXT DEFAULT 'Y',
  ord        INTEGER DEFAULT 0,
  crt_dt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr    INTEGER,
  upd_dt     DATETIME,
  upd_usr    INTEGER
);
`)

db.exec(`
CREATE UNIQUE INDEX IF NOT EXISTS uq_pass_product_store_name
  ON pass_product (COALESCE(store_id, -1), prod_nm);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS com_code_dtl (
  grp_cd  TEXT NOT NULL,
  itm_cd  TEXT NOT NULL,
  dtl_cd  TEXT NOT NULL,
  det_nm  TEXT NOT NULL,
  attr1   TEXT,
  attr2   TEXT,
  use_yn  TEXT DEFAULT 'N',
  ord     INTEGER DEFAULT 0,
  crt_dt  DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr INTEGER,
  upd_dt  DATETIME,
  upd_usr INTEGER,
  PRIMARY KEY (grp_cd, itm_cd, dtl_cd),
  FOREIGN KEY (grp_cd) REFERENCES com_code_grp(grp_cd),
  FOREIGN KEY (grp_cd, itm_cd) REFERENCES com_code_itm(grp_cd, itm_cd)
);
`)

db.exec(`
CREATE TABLE IF NOT EXISTS seat (
  seat_id    INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id   INTEGER NOT NULL REFERENCES store(store_id),
  zone_id    INTEGER REFERENCES store_zone(zone_id),
  seat_no    TEXT,
  seat_nm    TEXT,
  status_cd  TEXT NOT NULL DEFAULT 'AVAILABLE',
  ver        INTEGER NOT NULL DEFAULT 0,
  r          INTEGER,
  c          INTEGER,
  x_coord    INTEGER,
  y_coord    INTEGER,
  width      INTEGER,
  height     INTEGER,
  rotate_deg REAL    NOT NULL DEFAULT 0,
  crt_dt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  crt_usr    INTEGER,
  upd_dt     DATETIME,
  upd_usr    INTEGER
);
`)

db.exec(`
CREATE UNIQUE INDEX IF NOT EXISTS uq_seat_zone_no
  ON seat (zone_id, seat_no)
  WHERE seat_no IS NOT NULL;
`)

db.exec(`
CREATE UNIQUE INDEX IF NOT EXISTS uq_seat_grid
  ON seat (COALESCE(store_id, 0), COALESCE(zone_id, 0), r, c)
  WHERE r IS NOT NULL AND c IS NOT NULL;
`)

db.exec(`
CREATE INDEX IF NOT EXISTS idx_seat_xy
  ON seat (COALESCE(store_id, 0), COALESCE(zone_id, 0), x_coord, y_coord);
`)

export default db
