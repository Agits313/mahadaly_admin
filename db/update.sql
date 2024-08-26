
CREATE TABLE `_d_transaksi` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nomor` int(11) DEFAULT 0,
  `nomor_transaksi` varchar(50) DEFAULT NULL,
  `id_member` int(11) DEFAULT NULL,
  `status` int(1) DEFAULT 0 COMMENT '0=dalam proses pinjam, 1=dikembalikan',
  `is_delete` int(11) DEFAULT 0,
  `is_active` int(11) DEFAULT 1,
  `input_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `_d_transaksi_id_IDX` (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;


-- db_pustaka.`_d_transaksi_detail` definition

CREATE TABLE `_d_transaksi_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_transaksi` bigint(20) DEFAULT NULL,
  `id_member` int(11) DEFAULT NULL,
  `id_buku` int(11) DEFAULT NULL,
  `tanggal_kembali` datetime DEFAULT NULL,
  `tanggal_dikembalikan` datetime DEFAULT NULL,
  `terlambat` int(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `_d_transaksi_detail_id_IDX` (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `db_pustaka`.`_v_d_member` AS
select
    `dm`.`id` AS `row_number`,
    `dm`.`fullname` AS `main_label`,
    `dm`.`id` AS `id`,
    `dm`.`fullname` AS `fullname`,
    `dm`.`nickname` AS `nickname`,
    `dm`.`email` AS `email`,
    `dm`.`phone` AS `phone`,
    `dm`.`password` AS `password`,
    `dm`.`is_delete` AS `is_delete`,
    `dm`.`is_active` AS `is_active`,
    date_format(`dm`.`input_date`, '%Y-%m-%d %H:%i:%s') AS `input_date`,
    date_format(`dm`.`update_date`, '%Y-%m-%d %H:%i:%s') AS `update_date`
from
    `db_pustaka`.`_d_member` `dm`
where
    `dm`.`is_delete` = '0';


-- db_pustaka.`_v_d_stok_buku` source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `db_pustaka`.`_v_d_stok_buku` AS
select
    `mb`.`id` AS `row_number`,
    `mb`.`id` AS `id`,
    `mb`.`id_kategori` AS `id_kategori`,
    `mkb`.`name` AS `kategori`,
    `mb`.`judul` AS `judul`,
    `mb`.`penulis` AS `penulis`,
    (
    select
        coalesce(`dsb`.`stok`, 0) AS `stok`
    from
        `db_pustaka`.`_d_stok_buku` `dsb`
    where
        `dsb`.`id_buku` = `mb`.`id`) AS `stok`,
    `mb`.`tahun_terbit` AS `tahun_terbit`,
    `mb`.`cover` AS `cover`,
    `mb`.`input_date` AS `input_date`,
    `mb`.`is_delete` AS `is_delete`,
    `mb`.`is_active` AS `is_active`
from
    (`db_pustaka`.`_m_buku` `mb`
left join `db_pustaka`.`_m_kategori_buku` `mkb` on
    (`mkb`.`id` = `mb`.`id_kategori`));


-- db_pustaka.`_v_d_transaksi` source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `db_pustaka`.`_v_d_transaksi` AS
select
    `dt`.`id` AS `row_number`,
    `dt`.`nomor_transaksi` AS `main_label`,
    `dt`.`id` AS `id`,
    `dt`.`nomor` AS `nomor`,
    `dt`.`nomor_transaksi` AS `nomor_transaksi`,
    `dt`.`id_member` AS `id_member`,
    `dm`.`nim` AS `nim`,
    `dm`.`fullname` AS `fullname`,
    `dtd`.`id_buku` AS `id_buku`,
    `mb`.`judul` AS `judul`,
    `dt`.`status` AS `status`,
    date_format(`dt`.`input_date`, '%Y-%m-%d %H:%i:%s') AS `input_date`,
    date_format(`dt`.`input_date`, '%Y-%m-%d') AS `tanggal_pinjam`,
    date_format(`dtd`.`tanggal_kembali`, '%Y-%m-%d') AS `tanggal_kembali`,
    `dtd`.`tanggal_dikembalikan` AS `tanggal_dikembalikan`,
    `dt`.`is_delete` AS `is_delete`,
    `dt`.`is_active` AS `is_active`
from
    (((`db_pustaka`.`_d_transaksi` `dt`
join `db_pustaka`.`_d_member` `dm` on
    (`dm`.`id` = `dt`.`id_member`))
join `db_pustaka`.`_d_transaksi_detail` `dtd` on
    (`dtd`.`id_transaksi` = `dt`.`id`))
join `db_pustaka`.`_m_buku` `mb` on
    (`mb`.`id` = `dtd`.`id_buku`))
where
    `dt`.`is_delete` = '0';


-- db_pustaka.`_v_m_buku` source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `db_pustaka`.`_v_m_buku` AS
select
    `mb`.`id` AS `row_number`,
    `mb`.`judul` AS `main_label`,
    `mb`.`id` AS `id`,
    `mb`.`id_kategori` AS `id_kategori`,
    `mkb`.`name` AS `kategori`,
    `mb`.`judul` AS `judul`,
    `mb`.`penulis` AS `penulis`,
    `mb`.`tahun_terbit` AS `tahun_terbit`,
    `mb`.`sinopsis` AS `sinopsis`,
    `mb`.`cover` AS `cover`,
    date_format(`mb`.`input_date`, '%Y-%m-%d %H:%i:%s') AS `input_date`,
    `mb`.`is_delete` AS `is_delete`,
    `mb`.`is_active` AS `is_active`
from
    (`db_pustaka`.`_m_buku` `mb`
left join `db_pustaka`.`_m_kategori_buku` `mkb` on
    (`mkb`.`id` = `mb`.`id_kategori`))
where
    `mb`.`is_delete` = '0';


-- db_pustaka.`_v_m_kategori_buku` source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `db_pustaka`.`_v_m_kategori_buku` AS
select
    `mk`.`id` AS `row_number`,
    `mk`.`name` AS `main_label`,
    `mk`.`id` AS `id`,
    `mk`.`name` AS `name`,
    date_format(`mk`.`input_date`, '%Y-%m-%d %H:%i:%s') AS `input_date`,
    `mk`.`is_delete` AS `is_delete`,
    `mk`.`is_active` AS `is_active`
from
    `db_pustaka`.`_m_kategori_buku` `mk`
where
    `mk`.`is_delete` = '0';


-- db_pustaka.`_v_m_level` source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `db_pustaka`.`_v_m_level` AS
select
    row_number() over (
order by
    `ml`.`id`) AS `row_number`,
    `ml`.`label` AS `main_label`,
    `ml`.`id` AS `id`,
    `ml`.`label` AS `label`,
    `ml`.`is_delete` AS `is_delete`,
    `ml`.`is_active` AS `is_active`,
    date_format(`ml`.`input_date`, '%Y-%m-%d %H:%i:%s') AS `input_date`
from
    `db_pustaka`.`_m_level` `ml`
where
    `ml`.`is_delete` = '0';


-- db_pustaka.`_v_m_web_menu` source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `db_pustaka`.`_v_m_web_menu` AS
select
    `mw`.`id` AS `row_number`,
    `mw`.`label` AS `main_label`,
    `mw`.`id` AS `id`,
    `mw`.`label` AS `label`,
    `mw`.`typecontent` AS `typecontent`,
    `mw`.`icon` AS `icon`,
    `mw`.`link` AS `link`,
    `mw`.`parent` AS `parent`,
    `mw`.`is_delete` AS `is_delete`,
    `mw`.`is_active` AS `is_active`,
    `mw`.`position` AS `position`,
    date_format(`mw`.`input_date`, '%Y-%m-%d %H:%i:%s') AS `input_date`
from
    `db_pustaka`.`_m_menu_web` `mw`
where
    `mw`.`is_delete` = '0'
group by
    `mw`.`id`;


-- db_pustaka.`_v_menu` source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `db_pustaka`.`_v_menu` AS
select
    `main`.`id` AS `id`,
    `main`.`label` AS `label`,
    `main`.`link` AS `link`,
    `main`.`icon` AS `icon`,
    exists(
    select
        1
    from
        `db_pustaka`.`_m_menu` `sub`
    where
        `sub`.`parent` = `main`.`id`
    limit 1) AS `has_submenu`,
    `main`.`parent` AS `parent`,
    `main`.`position` AS `position`,
    `main`.`is_delete` AS `is_delete`,
    `main`.`is_active` AS `is_active`,
    date_format(`main`.`input_date`, '%Y-%m-%d %H:%i:%s') AS `input_date`
from
    `db_pustaka`.`_m_menu` `main`
where
    `main`.`is_delete` = 0;


-- db_pustaka.`_v_users` source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `db_pustaka`.`_v_users` AS
select
    `mu`.`id` AS `id`,
    `mu`.`username` AS `username`,
    `mu`.`username` AS `main_label`,
    `mu`.`password` AS `password`,
    `mu`.`id_level` AS `id_level`,
    `mu`.`is_active` AS `is_active`,
    `mu`.`is_delete` AS `is_delete`,
    `mu`.`input_date` AS `input_date`
from
    `db_pustaka`.`_m_users` `mu`
where
    `mu`.`is_delete` = 0;