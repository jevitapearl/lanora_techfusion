import argparse
from lanora.auth import login, register, logout
from lanora.commands.test import run_test, run_deploy
import sys

public_commands = ["login", "register"]

def main():
    if len(sys.argv) < 2:
        print("Usage: lanora <command>")
        return

    cmd = sys.argv[1]

    if cmd == "register":
        register()

    elif cmd == "login":
        login()

    elif cmd == "logout":
        logout()

    elif cmd == "test":
        run_test()

    elif cmd == "deploy":
       run_deploy()

    else:
        print("Unknown command")


if __name__ == "__main__":
    main()
    