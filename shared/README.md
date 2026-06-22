# 🔗 Shared — Contratos compartidos

Tipos TypeScript compartidos del frontend.

## Archivo: `types.ts`

### Interfaces principales

```ts
interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'tutor' | 'student' | 'pending';
  password?: string; // solo para registro
}

interface Planet {
  id: number;
  name: string;
  subject: string;
  description: string;
  icon: string;
  gradient: string;
}

interface Course {
  id: number;
  planet_id: number;
  name: string;
  description: string;
  order_index: number;
}

interface Level {
  id: number;
  course_id: number;
  name: string;
  description: string;
  order_index: number;
  type: 'multiple_choice' | 'true_false' | 'drag_drop' | 'fill_blank';
  questions: Question[];
}

interface Question {
  id: number;
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}
```

### Uso

```ts
import type { User, Planet } from '../../shared/types';
```
