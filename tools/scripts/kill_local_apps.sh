#!/usr/bin/env sh

echo "\033[32m✔\033[m Kill local apps"
user_client_pid="$(lsof -t -i :3000)"
if [[ "" !=  "$user_client_pid" ]]; then
    echo "killing client user"
    kill -9 $user_client_pid
fi
server_pid="$(lsof -t -i :8000)"
if [[ "" !=  "$server_pid" ]]; then
    echo "killing server user"
    kill -9 $server_pid
fi
exit 0
