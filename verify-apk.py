#!/usr/bin/env python3

import zipfile
import os

def verify_apk(apk_path):
    print(f"🔍 Verifying APK: {apk_path}")
    
    if not os.path.exists(apk_path):
        print("❌ APK file not found")
        return False
    
    file_size = os.path.getsize(apk_path)
    print(f"📊 File size: {file_size / (1024*1024):.1f} MB")
    
    try:
        with zipfile.ZipFile(apk_path, 'r') as apk:
            file_list = apk.namelist()
            
            # Check for essential APK files
            required_files = ['AndroidManifest.xml', 'classes.dex']
            missing_files = []
            
            for req_file in required_files:
                if req_file not in file_list:
                    missing_files.append(req_file)
            
            print(f"📋 Total files in APK: {len(file_list)}")
            print(f"✅ Required files present: {len(required_files) - len(missing_files)}/{len(required_files)}")
            
            if missing_files:
                print(f"❌ Missing files: {', '.join(missing_files)}")
            
            # Check for key directories
            has_assets = any(f.startswith('assets/') for f in file_list)
            has_res = any(f.startswith('res/') for f in file_list)
            has_meta_inf = any(f.startswith('META-INF/') for f in file_list)
            
            print(f"📁 Has assets/: {has_assets}")
            print(f"📁 Has res/: {has_res}")
            print(f"📁 Has META-INF/: {has_meta_inf}")
            
            # Show first few files
            print("📄 First 10 files:")
            for i, filename in enumerate(file_list[:10]):
                print(f"   {i+1}. {filename}")
            
            return True
            
    except zipfile.BadZipFile:
        print("❌ Invalid ZIP/APK format")
        return False
    except Exception as e:
        print(f"❌ Error reading APK: {e}")
        return False

if __name__ == "__main__":
    apk_files = [
        "dist/public/zivora-installable.apk",
        "dist/public/zivora-production.apk", 
        "dist/public/zivora-debug.apk"
    ]
    
    for apk_file in apk_files:
        verify_apk(apk_file)
        print("-" * 50)