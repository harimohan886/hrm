<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    private const COMPANY_ROLE = User::TYPE_COMPANY;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate([
            'name' => self::COMPANY_ROLE,
            'guard_name' => 'web',
        ]);
    }

    public function test_registration_redirects_to_login()
    {
        $response = $this->get('/register');

        $response->assertRedirect(route('login'));
    }

    public function test_new_users_can_register()
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertViewIs('auth.verify-email');
    }
}
