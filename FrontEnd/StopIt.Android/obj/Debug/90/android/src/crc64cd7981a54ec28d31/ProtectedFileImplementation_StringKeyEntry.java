package crc64cd7981a54ec28d31;


public class ProtectedFileImplementation_StringKeyEntry
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		javax.crypto.SecretKey,
		java.security.Key,
		java.io.Serializable
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_getAlgorithm:()Ljava/lang/String;:GetGetAlgorithmHandler:Java.Security.IKeyInvoker, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null\n" +
			"n_getFormat:()Ljava/lang/String;:GetGetFormatHandler:Java.Security.IKeyInvoker, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null\n" +
			"n_getEncoded:()[B:GetGetEncodedHandler:Java.Security.IKeyInvoker, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null\n" +
			"";
		mono.android.Runtime.register ("Plugin.SecureStorage.ProtectedFileImplementation+StringKeyEntry, Plugin.SecureStorage", ProtectedFileImplementation_StringKeyEntry.class, __md_methods);
	}


	public ProtectedFileImplementation_StringKeyEntry ()
	{
		super ();
		if (getClass () == ProtectedFileImplementation_StringKeyEntry.class)
			mono.android.TypeManager.Activate ("Plugin.SecureStorage.ProtectedFileImplementation+StringKeyEntry, Plugin.SecureStorage", "", this, new java.lang.Object[] {  });
	}

	public ProtectedFileImplementation_StringKeyEntry (java.lang.String p0)
	{
		super ();
		if (getClass () == ProtectedFileImplementation_StringKeyEntry.class)
			mono.android.TypeManager.Activate ("Plugin.SecureStorage.ProtectedFileImplementation+StringKeyEntry, Plugin.SecureStorage", "System.String, mscorlib", this, new java.lang.Object[] { p0 });
	}


	public java.lang.String getAlgorithm ()
	{
		return n_getAlgorithm ();
	}

	private native java.lang.String n_getAlgorithm ();


	public java.lang.String getFormat ()
	{
		return n_getFormat ();
	}

	private native java.lang.String n_getFormat ();


	public byte[] getEncoded ()
	{
		return n_getEncoded ();
	}

	private native byte[] n_getEncoded ();

	private java.util.ArrayList refList;
	public void monodroidAddReference (java.lang.Object obj)
	{
		if (refList == null)
			refList = new java.util.ArrayList ();
		refList.add (obj);
	}

	public void monodroidClearReferences ()
	{
		if (refList != null)
			refList.clear ();
	}
}
