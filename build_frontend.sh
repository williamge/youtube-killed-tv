echo "Building react app"
cd frontend/
npm install 
npm run build
echo "React build complete"

echo "Preparing the static directory"
cd ..
mkdir -p priv/static/app
rm -r priv/static/app/*

echo "Copying over the build to the static directory"
cp -r frontend/build/* priv/static/app/
echo "Copy complete"

echo "Frontend build script complete"
