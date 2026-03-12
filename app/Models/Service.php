<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function responsibilities()
    {
        return $this->hasMany(Responsibility::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
