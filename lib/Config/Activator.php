<?php

namespace MailPoet\Config;

use MailPoet\Models\Setting;

if(!defined('ABSPATH')) exit;

class Activator {
  function activate() {
    $migrator = new Migrator();
    $migrator->up();

    $populator = new Populator();
    $populator->up();
    Setting::setValue('db_version', Env::$version);
  }

  function deactivate() {
    $migrator = new Migrator();
    $migrator->down();
  }
}