<?php

namespace App\Console\Commands;

use Artisan;
use Illuminate\Console\Command;

class InstallCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install command';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        if (!app()->environment('production')) {
            Artisan::call("migrate:fresh");
            Artisan::call("db:seed");
        }

        return 0;
    }
}
