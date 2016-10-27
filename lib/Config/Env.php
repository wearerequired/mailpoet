<?php
namespace MailPoet\Config;

if(!defined('ABSPATH')) exit;

class Env {
  static $version;
  static $plugin_name;
  static $plugin_path;
  static $file;
  static $path;
  static $views_path;
  static $assets_path;
  static $assets_url;
  static $temp_path;
  static $temp_url;
  static $languages_path;
  static $lib_path;
  static $plugin_prefix;
  static $db_prefix;
  static $db_source_name;
  static $db_host;
  static $db_socket;
  static $db_port;
  static $db_name;
  static $db_username;
  static $db_password;
  static $db_charset;
  static $db_timezone_offset;

  static function init($file, $version) {
    global $wpdb;
    self::$version = $version;
    self::$file = $file;
    self::$path = dirname(self::$file);
    self::$plugin_name = 'mailpoet';
    self::$views_path = self::$path . '/views';
    self::$assets_path = self::$path . '/assets';
    self::$assets_url = plugins_url('/assets', $file);
    $wp_upload_dir = wp_upload_dir();
    self::$temp_path = $wp_upload_dir['basedir'] . '/' . self::$plugin_name;
    if(!is_dir(self::$temp_path)) {
      mkdir(self::$temp_path);
    }
    self::$temp_url = $wp_upload_dir['baseurl'] . '/' . self::$plugin_name;
    self::$languages_path = self::$path . '/lang';
    self::$lib_path = self::$path . '/lib';
    self::$plugin_prefix = 'mailpoet_';
    self::$db_prefix = $wpdb->prefix . self::$plugin_prefix;
    self::$db_host = DB_HOST;
    self::$db_port = 3306;
    self::$db_socket = false;
    if(preg_match('/(?=:\d+$)/', DB_HOST)) {
      list(self::$db_host, self::$db_port) = explode(':', DB_HOST);
    } else {
      if(preg_match('/:/', DB_HOST)) {
        self::$db_socket = true;
      }
    }
    self::$db_name = DB_NAME;
    self::$db_username = DB_USER;
    self::$db_password = DB_PASSWORD;
    self::$db_charset = $wpdb->get_charset_collate();
    self::$db_source_name = self::dbSourceName(self::$db_host, self::$db_socket, self::$db_port);
    self::$db_timezone_offset = self::getDbTimezoneOffset();
  }

  private static function dbSourceName($host, $socket, $port) {
    $source_name = array(
      (!$socket) ? 'mysql:host=' : 'mysql:unix_socket=',
      $host,
      ';',
      'port=',
      $port,
      ';',
      'dbname=',
      DB_NAME
    );
    return implode('', $source_name);
  }

  private static function getDbTimezoneOffset() {
    $mins = get_option('gmt_offset') * 60;
    $sgn = ($mins < 0 ? -1 : 1);
    $mins = abs($mins);
    $hrs = floor($mins / 60);
    $mins -= $hrs * 60;
    return sprintf('%+d:%02d', $hrs * $sgn, $mins);
  }
}