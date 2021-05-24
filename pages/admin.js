import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Admin() {
    const router = useRouter();
    useEffect(()=>router.push("/admin/addmatch"), []);

    return (<></>)
}
