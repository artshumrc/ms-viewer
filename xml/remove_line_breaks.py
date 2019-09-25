from os import listdir
from os.path import isfile, join
import os, io, argparse, re

def main(mypath="manuscripts_2019_02_20/"):
    ap = argparse.ArgumentParser()
    ap.add_argument("-p", "--path", required=False)
    args = ap.parse_args()
    if(args.path and os.path.isdir(args.path)):
        mypath = args.path

    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f)) and f.lower().endswith(".xml")]
    print(onlyfiles)
    outDir = mypath + "noBreaks"
    if(not os.path.isdir(outDir)):
        os.mkdir(outDir)
    for file in onlyfiles:
        oldfile = mypath + file
        newfile = outDir + "/" + file
        # with open(oldfile, 'rb') as f:with open(oldfile, mode="r", encoding="utf-8") as f:
        with open(oldfile, encoding="utf-8") as f:
            data = f.read()
            # print(repr(data))
            # data = re.sub(r'>\s+<', '><', data)
            # data = re.sub(r'\n\s+', '', data).strip()
            # data = re.sub(r'\r\s+', '', data).strip()
            data = data.replace("\r","")
            data = data.replace("\n","")
            data = re.sub(r'\s+', ' ', data).strip()

        with open(newfile, 'w') as f:
            f.write(data)


if __name__ == "__main__":
    main()
