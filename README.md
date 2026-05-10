# GrowCast - Smart Agricultural Management System

GrowCast is a Laravel-based agricultural management system that helps farmers make data-driven decisions about planting and spray applications using AI-powered recommendations based on weather forecasts.

## Features

- 🌱 Farm and Plant Management
- 🤖 AI-Powered Planting Recommendations
- 💧 Spray Timing Optimization
- 🌤️ Weather Forecast Integration
- 👥 User Management with Role-Based Access Control
- 📊 Comprehensive Dashboard

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 with TypeScript
- **UI Framework**: Inertia.js
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (default) / MySQL / PostgreSQL
- **Build Tool**: Vite 5
- **Testing**: Pest PHP

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **PHP 8.2 or higher** ([Download PHP](https://www.php.net/downloads))
- **Composer** ([Download Composer](https://getcomposer.org/download/))
- **Node.js 18+ and npm** ([Download Node.js](https://nodejs.org/))
- **Git** ([Download Git](https://git-scm.com/downloads))

### Required PHP Extensions

Make sure the following PHP extensions are enabled:

- `ext-pdo`
- `ext-sqlite3` (if using SQLite)
- `ext-mbstring`
- `ext-openssl`
- `ext-tokenizer`
- `ext-xml`
- `ext-ctype`
- `ext-json`
- `ext-bcmath`
- `ext-fileinfo`

You can check installed extensions by running:

```bash
php -m
```

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/growcast.git
cd growcast
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

This will install all Laravel and PHP packages defined in `composer.json`.

### Step 3: Install JavaScript Dependencies

```bash
npm install
```

This installs all React, TypeScript, and build tool dependencies.

### Step 4: Environment Configuration

1. Copy the example environment file:

```bash
# On Windows (PowerShell)
Copy-Item .env.example .env

# On macOS/Linux
cp .env.example .env
```

2. Generate application key:

```bash
php artisan key:generate
```

3. Configure your `.env` file with the following settings:

#### Basic Application Settings

```env
APP_NAME=GrowCast
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
```

#### Database Configuration

**MySQL Configuration:**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=growcast
DB_USERNAME=root
DB_PASSWORD=
```

> **Note**: Make sure MySQL is running and create the database:
>
> ```sql
> CREATE DATABASE growcast;
> ```

#### API Keys (Required for AI Features)

**OpenAI API Key** (Required for AI recommendations):

```env
OPENAI_API_KEY=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
```

**OpenWeather API Key** (Required for weather forecasts):

```env
OPENWEATHER_API_KEY=d73fafd157e7aa135a30bfd1ecac79f7
OPENWEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

> **Important**: These API keys are active for this project. If you need your own:
>
> - OpenAI: Sign up at [OpenAI Platform](https://platform.openai.com/)
> - OpenWeather: Sign up at [OpenWeatherMap](https://openweathermap.org/api)

### Step 5: Database Setup

1. Create the MySQL database:

```sql
CREATE DATABASE growcast;
```

You can do this via MySQL command line:

```bash
mysql -u root -p
CREATE DATABASE growcast;
exit;
```

Or using a tool like phpMyAdmin, MySQL Workbench, or HeidiSQL.

2. Run database migrations:

```bash
php artisan migrate
```

This creates all necessary database tables including:

- `users` - User accounts
- `roles` and `permissions` - Role-based access control
- `farms` - Farm information
- `plants` - Plant records
- `sprays` - Spray application history
- `weather` - Weather data

3. **Seed the database** (Required for initial setup):

```bash
php artisan db:seed
```

This creates:

- **Roles**: Admin and Farmer roles with appropriate permissions
- **Test Users**: Pre-configured accounts you can use immediately

#### Default User Accounts Created by Seeder:

| Role   | Email               | Password | Permissions                             |
| ------ | ------------------- | -------- | --------------------------------------- |
| Admin  | admin@growcast.com  | password | Full access to all features             |
| Admin  | test@example.com    | password | Full access to all features             |
| Farmer | farmer@growcast.com | password | Farm management, plants, spray, weather |

**You can log in immediately with any of these accounts!**

### Step 6: Storage Link

Create a symbolic link for file storage:

```bash
php artisan storage:link
```

### Step 7: Build Frontend Assets

**For Development:**

```bash
npm run dev
```

**For Production:**

```bash
npm run build
```

## Running the Application

### Option 1: Using Artisan Serve (Simple)

1. Start the Laravel development server:

```bash
php artisan serve
```

2. In a new terminal, start the Vite dev server:

```bash
npm run dev
```

3. Access the application at: **http://localhost:8000**

### Option 2: Using Composer Scripts (Recommended)

Run everything with a single command:

```bash
composer run dev
```

This automatically starts:

- Laravel development server (port 8000)
- Queue worker
- Vite development server

### Option 3: With SSR (Server-Side Rendering)

```bash
composer run dev:ssr
```

This starts all services plus Inertia SSR for improved performance.

## First-Time Setup

### Login with Seeded Accounts

After running `php artisan db:seed`, you can immediately log in with pre-created accounts:

**Admin Account:**

- **Email**: `admin@growcast.com`
- **Password**: `password`
- **Capabilities**: Full system access, user management, all CRUD operations

**Farmer Account:**

- **Email**: `farmer@growcast.com`
- **Password**: `password`
- **Capabilities**: Manage farms, plants, sprays, and view weather data

**Test Admin Account:**

- **Email**: `test@example.com`
- **Password**: `password`
- **Capabilities**: Full admin access for testing

### Accessing the Application

1. Open your browser and go to: **http://localhost:8000**
2. Click on **"Login"**
3. Enter one of the credentials above
4. You'll be redirected to the dashboard

### Role-Based Access Control

The system uses **Spatie Laravel Permission** package for roles and permissions:

**Admin Role:**

- Access to all features
- User management
- Role and permission management
- Full CRUD on all resources

**Farmer Role:**

- Dashboard access
- Farms: View, Create, Edit, Delete
- Plants: View, Create, Edit, Delete
- Weather: View, Create, Edit, Delete
- Sprays: View, Create, Edit, Delete
- AI Recommendations (Planting & Spray Timing)

### Creating Additional Users

If you want to create more users manually:

1. Log in with an admin account
2. Navigate to "Users" in the sidebar (admin only)
3. Click "Add New User"
4. Fill in user details and assign a role
5. Save

Alternatively, new users can self-register if you enable registration in the Fortify configuration.

### Setting Up Your First Farm

1. Log in with your credentials
2. Navigate to "Farms" in the sidebar
3. Click "Add New Farm"
4. Fill in farm details:
    - Farm Name
    - Location (latitude/longitude or address)
    - Size (optional)
5. Save the farm

### Adding Plants

1. Navigate to "Plants" in the sidebar
2. Click "Add New Plant"
3. Enter plant information:
    - Plant Type (e.g., Tomato, Spinach, Lettuce)
    - Variety
    - Planting Date
    - Associated Farm
4. Save the plant

## Using AI Features

### AI Planting Recommendations

1. Navigate to the "Planting AI" section
2. Select your farm and plant type
3. The system will:
    - Fetch current weather forecasts
    - Analyze plant-specific requirements
    - Provide AI-powered recommendations
4. Review the recommendation including:
    - Best planting dates
    - Weather considerations
    - Risk assessment

### AI Spray Timing Recommendations

1. Navigate to "Spray Timing AI" in the sidebar
2. Select the farm and plant
3. (Optional) Add spray details:
    - Spray name
    - Type (Fungicide, Pesticide, etc.)
    - Purpose
4. Click "Get AI Recommendation"
5. Review recommendations for:
    - Optimal application timing
    - Weather window analysis
    - Application tips

For detailed spray AI documentation, see [SPRAY_RECOMMENDATION_SYSTEM.md](SPRAY_RECOMMENDATION_SYSTEM.md).

## Development

### Project Structure

```
GrowCast/
├── app/                    # Laravel application code
│   ├── Http/
│   │   ├── Controllers/   # Request handlers
│   │   └── Middleware/    # HTTP middleware
│   ├── Models/            # Eloquent models
│   ├── Services/          # Business logic
│   │   ├── OpenAIService.php
│   │   └── OpenWeatherService.php
│   └── Policies/          # Authorization policies
├── database/
│   ├── migrations/        # Database migrations
│   └── seeders/          # Database seeders
├── resources/
│   ├── js/               # React/TypeScript frontend
│   │   ├── components/   # React components
│   │   ├── layouts/      # Page layouts
│   │   └── pages/        # Inertia pages
│   └── css/              # Stylesheets
├── routes/
│   ├── web.php           # Web routes
│   ├── api.php           # API routes
│   └── settings.php      # Settings routes
├── tests/                # Pest PHP tests
├── .env.example          # Environment template
├── composer.json         # PHP dependencies
├── package.json          # JavaScript dependencies
└── vite.config.ts        # Vite configuration
```

### Running Tests

Run the test suite using Pest:

```bash
composer test
# or
php artisan test
```

### Code Formatting and Linting

**PHP (Laravel Pint):**

```bash
./vendor/bin/pint
```

**JavaScript/TypeScript (ESLint & Prettier):**

```bash
npm run lint        # Run ESLint with auto-fix
npm run format      # Format with Prettier
npm run format:check # Check formatting without changes
```

### Type Checking

```bash
npm run types
```

## Available Scripts

### Composer Scripts

```bash
composer run setup      # Complete project setup
composer run dev        # Start development servers
composer run dev:ssr    # Start with SSR support
composer run test       # Run tests
```

### NPM Scripts

```bash
npm run dev            # Start Vite dev server
npm run build          # Build for production
npm run build:ssr      # Build with SSR support
npm run lint           # Lint and fix code
npm run format         # Format code
npm run types          # Type check TypeScript
```

## Troubleshooting

### Common Issues

#### 1. "Class not found" errors

**Solution:**

```bash
composer dump-autoload
```

#### 2. Permission errors (Linux/macOS)

**Solution:**

```bash
chmod -R 775 storage bootstrap/cache
```

#### 3. Node modules issues

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
```

#### 4. Vite not connecting

**Solution:**

- Check that `npm run dev` is running
- Verify `APP_URL` in `.env` matches your local URL
- Clear browser cache

#### 5. Database connection errors

**For MySQL:**

- Verify MySQL is running:

    ```bash
    # Windows
    net start MySQL

    # Check if MySQL is accessible
    mysql -u root -p
    ```

- Check credentials in `.env`
- Ensure database exists:
    ```sql
    CREATE DATABASE growcast;
    ```
- Test connection:
    ```bash
    php artisan migrate:status
    ```

#### 6. API Key Errors

**OpenAI API Issues:**

- Verify API key is valid at https://platform.openai.com/api-keys
- Check you have billing enabled
- Ensure no spaces/extra characters in `.env`

**OpenWeather API Issues:**

- Verify API key at https://home.openweathermap.org/api_keys
- Note: Free tier has rate limits (60 calls/minute)
- API key may take a few hours to activate

### Cache Issues

Clear all caches:

```bash
php artisan optimize:clear
```

Or clear specific caches:

```bash
php artisan config:clear   # Clear config cache
php artisan route:clear    # Clear route cache
php artisan view:clear     # Clear view cache
php artisan cache:clear    # Clear application cache
```

## Production Deployment

### Building for Production

1. Set environment to production:

```env
APP_ENV=production
APP_DEBUG=false
```

2. Build frontend assets:

```bash
npm run build
```

3. Optimize Laravel:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

4. Set up proper database (MySQL/PostgreSQL recommended)

```env
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=growcast_production
DB_USERNAME=your-db-user
DB_PASSWORD=strong-password-here
```

5. Configure a production web server (Nginx/Apache)

6. Set up queue workers:

```bash
php artisan queue:work --daemon
```

7. Set up scheduled tasks in cron:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

### Environment Variables for Production

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Use strong database
DB_CONNECTION=mysql
DB_DATABASE=growcast_production

# Enable caching
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Configure mail
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
```

## Security Considerations

1. **Never commit `.env` file** - It contains sensitive keys
2. **Keep dependencies updated**:
    ```bash
    composer update
    npm update
    ```
3. **Use strong APP_KEY** - Generate with `php artisan key:generate`
4. **Enable HTTPS in production**
5. **Set proper file permissions**
6. **Regularly backup your database**
7. **Monitor API usage** to avoid unexpected charges

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Coding Standards

- Follow PSR-12 for PHP code
- Use Laravel best practices
- Write tests for new features
- Run linters before committing:
    ```bash
    ./vendor/bin/pint
    npm run lint
    ```

## Support

For issues, questions, or contributions:

- **Issues**: [GitHub Issues](https://github.com/EdinGrazhda/GrowCast/issues)
- **Documentation**: See `/docs` folder for detailed guides
- **Email**: edingrazhda17@gmail.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Laravel Framework
- React and the React community
- Inertia.js
- OpenAI for AI capabilities
- OpenWeatherMap for weather data
- All open source contributors

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Inertia.js Documentation](https://inertiajs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Quick Start: Spray AI](QUICK_START_SPRAY_AI.md)
- [Spray Recommendation System](SPRAY_RECOMMENDATION_SYSTEM.md)

---

**Happy Farming! 🌾**

Made with ❤️ for sustainable agriculture
