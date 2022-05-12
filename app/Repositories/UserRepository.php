<?php

namespace App\Repositories;

use Blok\Repository\AbstractEloquentRepository;

class UserRepository extends AbstractEloquentRepository
{
    public function model()
    {
        return \App\Models\User::class;
    }
}
