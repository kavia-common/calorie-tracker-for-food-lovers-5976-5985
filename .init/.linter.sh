#!/bin/bash
cd /home/kavia/workspace/code-generation/calorie-tracker-for-food-lovers-5976-5985/calory_app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

