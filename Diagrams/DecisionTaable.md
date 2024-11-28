decision table

### Authentication Decision Table

| Input Condition | Action 1 | Action 2 | Action 3 | Action 4 |
|----------------|----------|----------|----------|----------|
| **Email Status** | Empty | Valid | Invalid | Valid |
| **Password Status** | Empty | Valid | Valid | Invalid |
| **User Exists** | N/A | No | Yes | Yes |
| **Action** | Show Error | Create Account | Show Error | Show Error |
| **Result** | "Fields Required" | Success | "Email Exists" | "Invalid Password" |

### Movie Collection Management Table

| Input Condition | Action 1 | Action 2 | Action 3 | Action 4 |
|----------------|----------|----------|----------|----------|
| **User Authenticated** | No | Yes | Yes | Yes |
| **Movie in Collection** | N/A | No | Yes | N/A |
| **Action Request** | View | Add | Remove | View |
| **Action** | Redirect Login | Add Movie | Remove Movie | Show Collection |
| **Result** | Login Page | Success Toast | Success Toast | Display Movies |

### Video Playback Control Table

| Input Condition | Action 1 | Action 2 | Action 3 | Action 4 |
|----------------|----------|----------|----------|----------|
| **Video Status** | Not Started | Playing | Paused | Ended |
| **Volume Status** | Unmuted | Muted | Any | Any |
| **Fullscreen** | No | No | Yes | No |
| **Action** | Play | Toggle Mute | Exit Fullscreen | Return to Browse |
| **Result** | Start Video | Update Audio | Normal View | Close Player |

### Route Protection Table

| Input Condition | Action 1 | Action 2 | Action 3 |
|----------------|----------|----------|----------|
| **Auth Status** | Not Logged In | Logged In | Token Expired |
| **Route Type** | Protected | Protected | Protected |
| **Action** | Redirect | Allow Access | Logout |
| **Result** | Login Page | Show Content | Login Page |

### API Request Table

| Input Condition | Action 1 | Action 2 | Action 3 | Action 4 |
|----------------|----------|----------|----------|----------|
| **API Status** | Available | Error | Available | Timeout |
| **Request Type** | Get Movies | Get Movies | Search | Any |
| **Cache Status** | No Cache | Use Cache | No Cache | No Cache |
| **Action** | Fetch New | Use Cached | Search API | Retry |
| **Result** | Show Movies | Show Cached | Show Results | Show Error |

This decision table helps in:
1. Understanding system behavior under different conditions
2. Identifying edge cases and error scenarios
3. Determining appropriate actions for each condition
4. Planning error handling and user feedback
5. Maintaining consistent behavior across features
