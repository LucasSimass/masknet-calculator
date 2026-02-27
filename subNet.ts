/*
  1) get user input and verify and refine all possible issues
  2) split info to sectors
*/

class maskNet {
  
  // MATH SECTION
  private stringValidIntFiniteNumber(string : string): boolean {
    const fByteString = parseInt(string);
    return !isNaN(fByteString) && isFinite(fByteString); 
  }

  private isEven(number: number): boolean {
    return number % 2 == 0;
  }
  
  //----------------------------------------------------

  /**
   * Verify if maskNet is valid.
   * 
   * @param {string} maskNet - the maskNet string
   * 
   * @throws {Error} if maskNet string input apresent an error
   * 
  */
  private verifymaskNet(maskNet: string){
    const clearmaskNet = maskNet.replaceAll(" ", "");
    
    const isCIRD = (maskNet.split("/").length - 1) == 1; // is /x ?
    const isDDN = (maskNet.split(".").length) == 4;// is x.x.x.x ?

    console.log(maskNet.split("/"));
    console.log(maskNet.split("."));

    console.log(maskNet.split("/").length);
    console.log(maskNet.split(".").length);
    
    
    console.log(isCIRD);
    console.log(isDDN);

    // can't be CIRD and DDN  
    if (isCIRD && isDDN){
      throw new Error("Your maskNet should be x.x.x.x or /x")
    }

    // is not CIRD and DDN  
    if (!isCIRD && !isDDN){
      throw new Error("Your maskNet should be x.x.x.x or /x")
    }

    // can't be empty
    if (clearmaskNet.length == 0){
      throw new Error("Masknet input is empty")
    }


    if (isDDN){
      console.log("is ddn");
      
      const splitDDN = maskNet.split(".");
      
      let lastByteString;
      for (let i = 0; i < splitDDN.length; i++) {
        const byteString = splitDDN.at(i);
        if (!byteString) {
          throw new Error("Byte not found, one of the bytes is not setted, did you miss 0?")
        }
        
        const iByteString = parseInt(byteString);
        const isNumber = this.stringValidIntFiniteNumber(byteString);

        if (!isNumber) {
          throw new Error(`An byte of the masknet is NOT an valid byte number`);
        }

        // iByteString < 0 or >255 ?
        if (iByteString < 0 || iByteString > 255){
          throw new Error(`An byte of the mask net is can't be < 0 or >255`);
        }

        // if the last byte is not 255, you can't add another number without being 0
        if (lastByteString && parseInt(lastByteString) !== 255 && iByteString > 0){
          throw new Error(`An byte of the mask net is can't be > 0 \nError Example: 255.0.255.0 -> THIS WILL RETURN AN ERROR!`);
        }

        // this is the subnet or an local net input
        if (iByteString != 255 && iByteString % 2 != 0){
          throw new Error(`The subnet mask need be an even`);
        }
        
        // add last byte
        lastByteString = byteString;
      }

      return;
    }
    
    if (isCIRD) {
      const clearCIRD = maskNet.replaceAll('/', '');
      const iCIRD = parseInt(clearCIRD);
      const isValidNumber = this.stringValidIntFiniteNumber(clearCIRD);
      if (!isValidNumber) {
        throw new Error(`${maskNet} is not an valid CIRD`)
      } 

      if (iCIRD < 0 || iCIRD > 32){
        throw new Error(`${maskNet} can't be <0 or >32`)
      }
    

      return;
    }
  }

  /**
   * Can be x.x.x.x or /x
   * 
   * @param {string} maskNet - your maskNet mask (x.x.x.x or /x)
  */
  public setmaskNet(maskNet: string){
    this.verifymaskNet(maskNet)
    return this;
  }
}

const sn = new maskNet().setmaskNet("255.255.255.0");
console.log("oi")