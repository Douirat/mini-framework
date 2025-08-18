import time
from playwright.sync_api import sync_playwright, expect

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        context1 = browser.new_context()
        page1 = context1.new_page()
        context2 = browser.new_context()
        page2 = context2.new_page()

        try:
            # --- Player 1 Joins ---
            page1.goto("http://localhost:8000", timeout=60000)
            nickname_input1 = page1.get_by_placeholder("Enter your nickname")
            expect(nickname_input1).to_be_visible()
            nickname_input1.fill("Player_1_Jules")
            page1.get_by_role("button", name="Join Game").click()
            expect(nickname_input1).to_be_hidden(timeout=10000)
            print("Player 1 joined.")

            # --- Player 2 Joins ---
            page2.goto("http://localhost:8000", timeout=60000)
            nickname_input2 = page2.get_by_placeholder("Enter your nickname")
            expect(nickname_input2).to_be_visible()
            nickname_input2.fill("Player_2_Loser")
            page2.get_by_role("button", name="Join Game").click()
            expect(nickname_input2).to_be_hidden(timeout=10000)
            print("Player 2 joined.")

            # --- Game Starts ---
            board1 = page1.locator(".board")
            expect(board1).to_be_visible(timeout=35000)
            print("Game started.")

            app_container1 = page1.locator(".app-container")
            app_container1.focus()
            app_container2 = page2.locator(".app-container")
            app_container2.focus()

            player_1_status = page1.locator(".player-status.player-1")
            player_2_status = page1.locator(".player-status.player-2")

            # --- Gameplay: P1 bombs P2 three times ---
            for i in range(3):
                print(f"--- Round {i+1} ---")

                # Move Player 1 into position to attack Player 2
                # P1 starts top-left, P2 starts bottom-right.
                # A simple strategy: P1 drops a bomb and moves away. P2 moves into the blast.

                # Move P1 to a safe spot first
                app_container1.press("ArrowDown", delay=100)
                time.sleep(0.5)

                # Move Player 2 into a known vulnerable spot, e.g., (0,0)
                print("Moving Player 2 into position...")
                for _ in range(400): # More than enough presses
                    app_container2.press("ArrowLeft", delay=15)
                for _ in range(400):
                    app_container2.press("ArrowUp", delay=15)

                # Wait for P2 to arrive
                time.sleep(2)

                # P1 moves back to drop the bomb
                app_container1.press("ArrowUp", delay=100)
                time.sleep(0.5)
                app_container1.press(" ", delay=100)
                print("Player 1 dropping bomb...")
                time.sleep(0.1)
                # P1 moves away to be safe
                app_container1.press("ArrowDown", delay=100)

                time.sleep(3.5) # Wait for explosion

                print(f"Verifying state after hit {i+1}...")
                expect(player_1_status.locator(".score")).to_contain_text(f"Score: {(i+1) * 100}")
                expect(player_2_status.locator(".lives")).to_contain_text(f"Lives: {2 - i}")
                print("State verified.")

            # --- Game Over ---
            print("Verifying game over screen...")
            expect(page1.locator(".game-over-screen")).to_be_visible(timeout=5000)
            winner_message = page1.locator(".game-over-screen h2")
            expect(winner_message).to_contain_text("Player_1_Jules Wins!")
            print("Game over screen verified.")

            page1.screenshot(path="jules-scratch/verification/verification.png")
            print("Screenshot taken successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
            page1.screenshot(path="jules-scratch/verification/error.png")
            raise e

        finally:
            browser.close()

if __name__ == "__main__":
    main()
