import math
import random
import tkinter as tk


WIDTH = 960
HEIGHT = 640
PADDLE_WIDTH = 140
PADDLE_HEIGHT = 16
BALL_SIZE = 16
BRICK_ROWS = 6
BRICK_COLUMNS = 10
BRICK_WIDTH = 78
BRICK_HEIGHT = 28
BRICK_GAP = 10
TOP_OFFSET = 90
BULLET_WIDTH = 6
BULLET_HEIGHT = 18


class StarBreaker:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("별돌깨기")
        self.root.resizable(False, False)

        self.canvas = tk.Canvas(
            root,
            width=WIDTH,
            height=HEIGHT,
            bg="#0b1020",
            highlightthickness=0,
        )
        self.canvas.pack()

        self.left_pressed = False
        self.right_pressed = False
        self.running = True
        self.game_over = False
        self.victory = False
        self.score = 0
        self.lives = 3
        self.level = 1
        self.stars = []
        self.bricks = []
        self.sparkles = []
        self.bullets = []

        self._create_background()
        self._create_ui()
        self._create_paddle()
        self._create_ball()
        self._create_bricks()
        self._bind_events()
        self.update()

    def _create_background(self) -> None:
        self.canvas.create_rectangle(0, 0, WIDTH, HEIGHT, fill="#08101f", outline="")
        self.canvas.create_oval(720, 40, 900, 220, fill="#1a2242", outline="")
        self.canvas.create_oval(70, 50, 180, 160, fill="#111b34", outline="")
        for _ in range(90):
            x = random.randint(0, WIDTH)
            y = random.randint(0, HEIGHT)
            size = random.randint(1, 3)
            shade = random.choice(["#ffffff", "#d7e7ff", "#ffeab8"])
            self.stars.append(self.canvas.create_oval(x, y, x + size, y + size, fill=shade, outline=""))

    def _create_ui(self) -> None:
        self.title_text = self.canvas.create_text(
            24,
            24,
            anchor="nw",
            text="STAR BREAKER",
            fill="#fff2c6",
            font=("Segoe UI", 24, "bold"),
        )
        self.info_text = self.canvas.create_text(
            WIDTH - 24,
            28,
            anchor="ne",
            text="",
            fill="#dbe6ff",
            font=("Segoe UI", 14, "bold"),
        )
        self.message_text = self.canvas.create_text(
            WIDTH / 2,
            HEIGHT / 2,
            text="좌우 방향키로 이동\nSpace로 시작 / 재시작",
            fill="#ffffff",
            font=("Segoe UI", 24, "bold"),
            justify="center",
        )
        self._refresh_ui()

    def _create_paddle(self) -> None:
        x1 = (WIDTH - PADDLE_WIDTH) / 2
        y1 = HEIGHT - 60
        x2 = x1 + PADDLE_WIDTH
        y2 = y1 + PADDLE_HEIGHT
        self.paddle = self.canvas.create_rectangle(
            x1, y1, x2, y2, fill="#6fe7ff", outline="#b9fbff", width=2
        )
        self.paddle_speed = 11

    def _create_ball(self) -> None:
        start_x = WIDTH / 2 - BALL_SIZE / 2
        start_y = HEIGHT - 90
        self.ball = self.canvas.create_oval(
            start_x,
            start_y,
            start_x + BALL_SIZE,
            start_y + BALL_SIZE,
            fill="#ffd166",
            outline="#fff4c2",
            width=2,
        )
        self.ball_dx = 0
        self.ball_dy = 0
        self.ball_attached = True

    def _create_bricks(self) -> None:
        for brick in self.bricks:
            self.canvas.delete(brick["id"])
        self.bricks.clear()

        total_width = BRICK_COLUMNS * BRICK_WIDTH + (BRICK_COLUMNS - 1) * BRICK_GAP
        start_x = (WIDTH - total_width) / 2
        colors = ["#ff6b6b", "#ff9f43", "#feca57", "#1dd1a1", "#54a0ff", "#a29bfe"]

        for row in range(BRICK_ROWS):
            for col in range(BRICK_COLUMNS):
                x1 = start_x + col * (BRICK_WIDTH + BRICK_GAP)
                y1 = TOP_OFFSET + row * (BRICK_HEIGHT + BRICK_GAP)
                x2 = x1 + BRICK_WIDTH
                y2 = y1 + BRICK_HEIGHT
                color = colors[row % len(colors)]
                brick_id = self.canvas.create_rectangle(
                    x1, y1, x2, y2, fill=color, outline="#fff6d6", width=2
                )
                strength = 1 + (1 if row < self.level - 1 else 0)
                self.bricks.append({"id": brick_id, "strength": strength, "color": color})
                if strength > 1:
                    self.canvas.create_text(
                        (x1 + x2) / 2,
                        (y1 + y2) / 2,
                        text=strength,
                        fill="#1b1b1b",
                        font=("Segoe UI", 10, "bold"),
                        tags=(f"label_{brick_id}",),
                    )

    def _bind_events(self) -> None:
        self.root.bind("<KeyPress-Left>", lambda _e: self._set_key("left", True))
        self.root.bind("<KeyRelease-Left>", lambda _e: self._set_key("left", False))
        self.root.bind("<KeyPress-Right>", lambda _e: self._set_key("right", True))
        self.root.bind("<KeyRelease-Right>", lambda _e: self._set_key("right", False))
        self.root.bind("<space>", lambda _e: self._space_action())
        self.root.bind("<KeyPress-p>", lambda _e: self._toggle_pause())
        self.root.bind("<KeyPress-P>", lambda _e: self._toggle_pause())
        self.root.bind("<KeyPress-z>", lambda _e: self._fire_bullet())
        self.root.bind("<KeyPress-Z>", lambda _e: self._fire_bullet())

    def _set_key(self, key: str, pressed: bool) -> None:
        if key == "left":
            self.left_pressed = pressed
        elif key == "right":
            self.right_pressed = pressed

    def _space_action(self) -> None:
        if self.game_over or self.victory:
            self._restart_game()
            return
        if self.ball_attached:
            self.ball_dx = random.choice([-5, -4, 4, 5])
            self.ball_dy = -6
            self.ball_attached = False
            self.canvas.itemconfigure(self.message_text, text="")
        else:
            self._toggle_pause()

    def _toggle_pause(self) -> None:
        if self.game_over or self.victory or self.ball_attached:
            return
        self.running = not self.running
        self.canvas.itemconfigure(self.message_text, text="일시정지" if not self.running else "")

    def _fire_bullet(self) -> None:
        if not self.running or self.game_over or self.victory or self.ball_attached:
            return

        paddle_x1, paddle_y1, paddle_x2, _ = self.canvas.coords(self.paddle)
        positions = [
            (paddle_x1 + 22, paddle_y1 - BULLET_HEIGHT),
            (paddle_x2 - 22 - BULLET_WIDTH, paddle_y1 - BULLET_HEIGHT),
        ]

        for x1, y1 in positions:
            bullet_id = self.canvas.create_rectangle(
                x1,
                y1,
                x1 + BULLET_WIDTH,
                y1 + BULLET_HEIGHT,
                fill="#fff4a3",
                outline="#ffd166",
                width=1,
            )
            self.bullets.append({"id": bullet_id, "speed": -14})

    def _restart_game(self) -> None:
        self.score = 0
        self.lives = 3
        self.level = 1
        self.game_over = False
        self.victory = False
        self.running = True
        self._create_bricks()
        self._reset_ball_and_paddle()
        self._refresh_ui()
        self.canvas.itemconfigure(self.message_text, text="좌우 방향키로 이동\nSpace로 시작 / 재시작")

    def _reset_ball_and_paddle(self) -> None:
        paddle_x = (WIDTH - PADDLE_WIDTH) / 2
        self.canvas.coords(
            self.paddle,
            paddle_x,
            HEIGHT - 60,
            paddle_x + PADDLE_WIDTH,
            HEIGHT - 60 + PADDLE_HEIGHT,
        )
        start_x = WIDTH / 2 - BALL_SIZE / 2
        start_y = HEIGHT - 90
        self.canvas.coords(self.ball, start_x, start_y, start_x + BALL_SIZE, start_y + BALL_SIZE)
        self.ball_dx = 0
        self.ball_dy = 0
        self.ball_attached = True
        self._clear_bullets()

    def _refresh_ui(self) -> None:
        self.canvas.itemconfigure(
            self.info_text,
            text=f"Score {self.score}   Lives {self.lives}   Level {self.level}",
        )

    def _move_paddle(self) -> None:
        x1, _, x2, _ = self.canvas.coords(self.paddle)
        if self.left_pressed and x1 > 12:
            self.canvas.move(self.paddle, -self.paddle_speed, 0)
        if self.right_pressed and x2 < WIDTH - 12:
            self.canvas.move(self.paddle, self.paddle_speed, 0)

        if self.ball_attached:
            paddle_x1, _, paddle_x2, paddle_y2 = self.canvas.coords(self.paddle)
            center_x = (paddle_x1 + paddle_x2) / 2 - BALL_SIZE / 2
            self.canvas.coords(
                self.ball,
                center_x,
                paddle_y2 - BALL_SIZE - 8,
                center_x + BALL_SIZE,
                paddle_y2 - 8,
            )

    def _move_ball(self) -> None:
        if self.ball_attached or not self.running:
            return

        self.canvas.move(self.ball, self.ball_dx, self.ball_dy)
        x1, y1, x2, y2 = self.canvas.coords(self.ball)

        if x1 <= 0 or x2 >= WIDTH:
            self.ball_dx *= -1
        if y1 <= 0:
            self.ball_dy *= -1
        if y2 >= HEIGHT:
            self.lives -= 1
            self._refresh_ui()
            if self.lives <= 0:
                self.game_over = True
                self.running = False
                self.canvas.itemconfigure(self.message_text, text="게임 오버\nSpace로 다시 시작")
            else:
                self.running = True
                self._reset_ball_and_paddle()
                self.canvas.itemconfigure(self.message_text, text="Space로 다시 시작")
            return

        self._check_paddle_collision()
        self._check_brick_collision()

    def _check_paddle_collision(self) -> None:
        bx1, by1, bx2, by2 = self.canvas.coords(self.ball)
        px1, py1, px2, py2 = self.canvas.coords(self.paddle)
        if bx2 >= px1 and bx1 <= px2 and by2 >= py1 and by1 <= py2 and self.ball_dy > 0:
            hit_pos = ((bx1 + bx2) / 2 - (px1 + px2) / 2) / (PADDLE_WIDTH / 2)
            self.ball_dx = max(-7, min(7, hit_pos * 7))
            self.ball_dy = -abs(self.ball_dy)

    def _check_brick_collision(self) -> None:
        ball_items = self.canvas.find_overlapping(*self.canvas.coords(self.ball))
        hit_brick = None
        for brick in self.bricks:
            if brick["id"] in ball_items:
                hit_brick = brick
                break

        if not hit_brick:
            return

        self.ball_dy *= -1
        self._damage_brick(hit_brick, 1, 100, 40)

    def _move_bullets(self) -> None:
        if not self.running:
            return

        for bullet in self.bullets[:]:
            self.canvas.move(bullet["id"], 0, bullet["speed"])
            x1, y1, x2, y2 = self.canvas.coords(bullet["id"])
            if y2 < 0:
                self.canvas.delete(bullet["id"])
                self.bullets.remove(bullet)
                continue

            overlapping = self.canvas.find_overlapping(x1, y1, x2, y2)
            hit_brick = None
            for brick in self.bricks:
                if brick["id"] in overlapping:
                    hit_brick = brick
                    break

            if hit_brick:
                self.canvas.delete(bullet["id"])
                self.bullets.remove(bullet)
                self._damage_brick(hit_brick, 1, 120, 50)

    def _damage_brick(self, brick: dict, damage: int, break_score: int, hit_score: int) -> None:
        brick["strength"] -= damage

        x1, y1, x2, y2 = self.canvas.coords(brick["id"])
        self._spawn_sparkles((x1 + x2) / 2, (y1 + y2) / 2)

        if brick["strength"] <= 0:
            self.canvas.delete(brick["id"])
            self.canvas.delete(f"label_{brick['id']}")
            if brick in self.bricks:
                self.bricks.remove(brick)
            self.score += break_score
        else:
            self.canvas.itemconfigure(brick["id"], fill=self._dim_color(brick["color"]))
            self.canvas.delete(f"label_{brick['id']}")
            self.canvas.create_text(
                (x1 + x2) / 2,
                (y1 + y2) / 2,
                text=str(brick["strength"]),
                fill="#1b1b1b",
                font=("Segoe UI", 10, "bold"),
                tags=(f"label_{brick['id']}",),
            )
            self.score += hit_score

        self._refresh_ui()
        self._check_level_clear()

    def _check_level_clear(self) -> None:
        if self.bricks:
            return

        if self.level < 3:
            self.level += 1
            self._create_bricks()
            self._reset_ball_and_paddle()
            self.canvas.itemconfigure(self.message_text, text=f"Level {self.level}\nSpace로 시작")
            self._refresh_ui()
        else:
            self.victory = True
            self.running = False
            self.canvas.itemconfigure(self.message_text, text="승리!\nSpace로 다시 시작")

    def _spawn_sparkles(self, x: float, y: float) -> None:
        for _ in range(10):
            angle = random.uniform(0, math.tau)
            speed = random.uniform(2.5, 5.5)
            item = self.canvas.create_oval(x - 2, y - 2, x + 2, y + 2, fill="#fff2a8", outline="")
            self.sparkles.append(
                {
                    "id": item,
                    "dx": math.cos(angle) * speed,
                    "dy": math.sin(angle) * speed,
                    "life": random.randint(12, 20),
                }
            )

    def _update_sparkles(self) -> None:
        for sparkle in self.sparkles[:]:
            self.canvas.move(sparkle["id"], sparkle["dx"], sparkle["dy"])
            sparkle["dy"] += 0.15
            sparkle["life"] -= 1
            if sparkle["life"] <= 0:
                self.canvas.delete(sparkle["id"])
                self.sparkles.remove(sparkle)

    def _clear_bullets(self) -> None:
        for bullet in self.bullets:
            self.canvas.delete(bullet["id"])
        self.bullets.clear()

    def _animate_stars(self) -> None:
        for index, star in enumerate(self.stars):
            if index % 2 == 0:
                self.canvas.move(star, 0, 0.12)
            else:
                self.canvas.move(star, 0, -0.08)
            x1, y1, x2, y2 = self.canvas.coords(star)
            if y1 > HEIGHT:
                self.canvas.move(star, 0, -HEIGHT - random.randint(0, 60))
            elif y2 < 0:
                self.canvas.move(star, 0, HEIGHT + random.randint(0, 60))

    def _dim_color(self, color: str) -> str:
        color = color.lstrip("#")
        r = int(color[0:2], 16)
        g = int(color[2:4], 16)
        b = int(color[4:6], 16)
        r = max(0, min(255, r - 35))
        g = max(0, min(255, g - 35))
        b = max(0, min(255, b - 35))
        return f"#{r:02x}{g:02x}{b:02x}"

    def update(self) -> None:
        self._animate_stars()
        self._move_paddle()
        self._move_ball()
        self._move_bullets()
        self._update_sparkles()
        self.root.after(16, self.update)


def main() -> None:
    root = tk.Tk()
    StarBreaker(root)
    root.mainloop()


if __name__ == "__main__":
    main()
