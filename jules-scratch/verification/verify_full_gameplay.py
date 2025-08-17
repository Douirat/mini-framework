import time
from playwright.sync_api import sync_playwright, expect

def join_game(page, nickname, expected_players):
    """Helper function for a player to join the game."""
    page.goto("http://localhost:8000")
    expect(page.get_by_placeholder("Enter your nickname")).to_be_visible()
    page.get_by_placeholder("Enter your nickname").fill(nickname)
    page.get_by_role("button", name="Join Game").click()
    expect(page.get_by_text(f"Players: {expected_players}/4")).to_be_visible()
    print(f"{nickname} joined the lobby.")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context1 = browser.new_context()
        page1 = context1.new_page() # Player 1 (Winner)
        context2 = browser.new_context()
        page2 = context2.new_page() # Player 2 (Loser)

        try:
            # 1. Both players join
            join_game(page1, "Winner", 1)
            join_game(page2, "Loser", 2)

            # 2. Wait for game to start
            board1 = page1.locator(".board")
            expect(board1).to_be_visible(timeout=35000)
            print("Game started.")
            app_container1 = page1.locator(".app-container")
            app_container1.focus()
            time.sleep(1) # Allow game to settle

            # 3. Repeat 3 times: P1 bombs P2
            for i in range(3):
                round_num = i + 1
                print(f"Round {round_num}: P1 attacking P2...")

                # P1 moves close to P2 and places a bomb
                # P2 is at the top-right corner. P1 needs to move towards the right.
                # This movement is brittle and depends on the map, but is necessary for a predictable test.
                app_container1.press("ArrowRight")
                time.sleep(0.1)
                app_container1.press("ArrowRight")
                time.sleep(0.1)
                app_container1.press("ArrowRight")
                time.sleep(1)
                app_container1.press(" ") # Place bomb
                print(f"Round {round_num}: Bomb placed.")

                # P1 retreats to safety
                app_container1.press("ArrowLeft")
                time.sleep(1)

                # Wait for explosion and state update
                # Expect P2's lives to decrease.
                # P2 starts with 3 lives. After round 1, 2 lives. After round 2, 1 life. etc.
                if round_num < 3:
                    lives_left = 3 - round_num
                    # Check from P1's view
                    expect(page1.locator(".player-status.player-2 .lives")).to_have_text(f"Lives: {lives_left}")
                    # Check from P2's view
                    expect(page2.locator(".player-status.player-2 .lives")).to_have_text(f"Lives: {lives_left}")
                    print(f"Round {round_num}: P2 has {lives_left} lives remaining. Correct.")
                    # Let P1 move back to attack position
                    app_container1.press("ArrowRight")
                    time.sleep(1)
                else:
                    # This is the final round, P2 should be dead.
                    print("Round 3: Waiting for P2 to be eliminated.")


            # 4. Assert Game Over screen
            print("Verifying Game Over screen...")
            expect(page1.get_by_role("heading", name="Game Over")).to_be_visible(timeout=5000)
            expect(page1.get_by_role("heading", name="Winner Wins!")).to_be_visible()
            print("Game Over screen verified for P1.")

            # Also check P2's screen
            expect(page2.get_by_role("heading", name="Game Over")).to_be_visible(timeout=5000)
            expect(page2.get_by_role("heading", name="Winner Wins!")).to_be_visible()
            print("Game Over screen verified for P2.")

            # 5. Take screenshot
            page1.screenshot(path="jules-scratch/verification/verification.png")
            print("Screenshot taken. Verification successful.")

        finally:
            browser.close()

if __name__ == "__main__":
    main()
