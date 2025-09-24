# Authentication Package for Landing Page

This package provides authentication functionality for the landing-page project, extracted and adapted from the main project's authentication system.

## Features

- **User Registration**: Complete signup flow with validation
- **User Login**: Secure authentication with username/password
- **Username Availability**: Real-time username checking
- **Password Strength**: Visual password strength indicator
- **Form Validation**: Comprehensive client-side validation
- **Token Management**: Automatic token storage and retrieval
- **Redirect Support**: URL parameter-based redirects after auth

## Components

### Core Files

- `src/lib/auth.ts` - Authentication utilities and API functions
- `src/context/AuthContext.tsx` - React context for authentication state
- `src/components/auth/SignupForm.tsx` - Enhanced signup form component
- `src/components/auth/LoginForm.tsx` - Enhanced login form component

### Updated Pages

- `src/pages/SignupPage.tsx` - Updated to use new SignupForm component
- `src/pages/LoginPage.tsx` - Updated to use new LoginForm component
- `src/App.tsx` - Updated to include AuthProvider

## API Integration

The authentication package connects to the main project's API endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/check-username` - Username availability check

## Configuration

### Environment Variables

The API base URL is configured in `src/lib/auth.ts`:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:5000';
```

Update this URL to point to your main project's server.

### CORS Configuration

Ensure the main project's server has CORS configured to allow requests from the landing-page domain:

```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Landing page and Vite dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

## Usage

### Basic Authentication Flow

1. **Registration**: Users can sign up with username, email, password, and personal details
2. **Login**: Users authenticate with username and password
3. **Token Storage**: Authentication tokens are automatically stored in localStorage
4. **Redirects**: Users are redirected based on URL parameters or default routes

### Form Features

#### Signup Form
- Real-time username availability checking
- Password strength indicator
- Form validation with error messages
- Terms of service agreement
- Email updates opt-in

#### Login Form
- Username/password authentication
- Password visibility toggle
- Automatic redirect for authenticated users
- Error handling and user feedback

### Authentication Context

```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, login, logout, signUp, isAuthenticated } = useAuth();
  
  // Use authentication state and methods
}
```

## Data Flow

1. **User Input**: Forms collect user data with validation
2. **API Calls**: Authentication functions make requests to main project API
3. **Token Storage**: Successful authentication stores tokens in localStorage
4. **State Management**: AuthContext manages authentication state
5. **Redirects**: Users are redirected to appropriate pages after authentication

## Security Features

- **Password Hashing**: Passwords are hashed on the server side
- **Token-based Auth**: JWT tokens for secure authentication
- **Input Validation**: Client and server-side validation
- **Username Format**: Enforced username format (lowercase, alphanumeric)
- **Password Strength**: Visual feedback for password requirements

## Error Handling

- Network error handling
- API error responses
- Form validation errors
- User-friendly error messages
- Loading states during authentication

## Integration with Main Project

This authentication package is designed to work seamlessly with the main project's authentication system:

- Uses the same API endpoints
- Compatible with existing user data structure
- Maintains token format consistency
- Supports the same authentication flow

## Development

### Testing Authentication

1. Start the main project server (port 5000)
2. Start the landing-page development server (port 5173)
3. Test registration and login flows
4. Verify token storage and redirects

### Customization

- Modify form validation rules in schema definitions
- Update UI components in auth form files
- Adjust API endpoints in auth.ts
- Customize redirect behavior in form components

## Dependencies

- React Hook Form for form management
- Zod for schema validation
- Lucide React for icons
- Framer Motion for animations
- Custom UI components (Button, Input, Card, etc.)

## Future Enhancements

- Password reset functionality
- Email verification
- Social login integration
- Two-factor authentication
- Session management improvements

