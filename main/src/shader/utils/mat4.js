import asFloat from './as_float';

export default function mat4 (m00=0, m01=0, m02=0, m03=0,
                              m10=0, m11=0, m12=0, m13=0,
                              m20=0, m21=0, m22=0, m23=0,
                              m30=0, m31=0, m32=0, m33=1, as = asFloat) {

    const toStr = as || function (x) { return x+'' }

    return `mat4(${toStr(m00)}, ${toStr(m01)}, ${toStr(m02)}, ${toStr(m03)}, ${toStr(m10)}, ${toStr(m11)}, ${toStr(m12)}, ${toStr(m13)}, ${toStr(m20)}, ${toStr(m21)}, ${toStr(m22)}, ${toStr(m23)}, ${toStr(m30)}, ${toStr(m31)}, ${toStr(m32)}, ${toStr(m33)})`;

}

