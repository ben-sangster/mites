#include "dmzMitesPluginHaul.h"
#include <dmzRuntimePluginFactoryLinkSymbol.h>
#include <dmzRuntimePluginInfo.h>

dmz::MitesPluginHaul::MitesPluginHaul (const PluginInfo &Info, Config &local) :
      Plugin (Info),
      TimeSlice (Info),
      ObjectObserverUtil (Info, local),
      _log (Info) {

   _init (local);
}


dmz::MitesPluginHaul::~MitesPluginHaul () {

}


// Plugin Interface
void
dmz::MitesPluginHaul::update_plugin_state (
      const PluginStateEnum State,
      const UInt32 Level) {

   if (State == PluginStateInit) {

   }
   else if (State == PluginStateStart) {

   }
   else if (State == PluginStateStop) {

   }
   else if (State == PluginStateShutdown) {

   }
}


void
dmz::MitesPluginHaul::discover_plugin (
      const PluginDiscoverEnum Mode,
      const Plugin *PluginPtr) {

   if (Mode == PluginDiscoverAdd) {

   }
   else if (Mode == PluginDiscoverRemove) {

   }
}


// TimeSlice Interface
void
dmz::MitesPluginHaul::update_time_slice (const Float64 TimeDelta) {


}


// Object Observer Interface
void
dmz::MitesPluginHaul::create_object (
      const UUID &Identity,
      const Handle ObjectHandle,
      const ObjectType &Type,
      const ObjectLocalityEnum Locality) {

}


void
dmz::MitesPluginHaul::destroy_object (
      const UUID &Identity,
      const Handle ObjectHandle) {

}


void
dmz::MitesPluginHaul::update_object_uuid (
      const Handle ObjectHandle,
      const UUID &Identity,
      const UUID &PrevIdentity) {

}


void
dmz::MitesPluginHaul::remove_object_attribute (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Mask &AttrMask) {

}


void
dmz::MitesPluginHaul::update_object_locality (
      const UUID &Identity,
      const Handle ObjectHandle,
      const ObjectLocalityEnum Locality,
      const ObjectLocalityEnum PrevLocality) {

}


void
dmz::MitesPluginHaul::link_objects (
      const Handle LinkHandle,
      const Handle AttributeHandle,
      const UUID &SuperIdentity,
      const Handle SuperHandle,
      const UUID &SubIdentity,
      const Handle SubHandle) {

}


void
dmz::MitesPluginHaul::unlink_objects (
      const Handle LinkHandle,
      const Handle AttributeHandle,
      const UUID &SuperIdentity,
      const Handle SuperHandle,
      const UUID &SubIdentity,
      const Handle SubHandle) {

}


void
dmz::MitesPluginHaul::update_link_attribute_object (
      const Handle LinkHandle,
      const Handle AttributeHandle,
      const UUID &SuperIdentity,
      const Handle SuperHandle,
      const UUID &SubIdentity,
      const Handle SubHandle,
      const UUID &AttributeIdentity,
      const Handle AttributeObjectHandle,
      const UUID &PrevAttributeIdentity,
      const Handle PrevAttributeObjectHandle) {


}


void
dmz::MitesPluginHaul::update_object_counter (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Int64 Value,
      const Int64 *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_counter_minimum (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Int64 Value,
      const Int64 *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_counter_maximum (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Int64 Value,
      const Int64 *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_alternate_type (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const ObjectType &Value,
      const ObjectType *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_state (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Mask &Value,
      const Mask *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_flag (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Boolean Value,
      const Boolean *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_time_stamp (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Float64 &Value,
      const Float64 *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_position (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Vector &Value,
      const Vector *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_orientation (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Matrix &Value,
      const Matrix *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_velocity (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Vector &Value,
      const Vector *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_acceleration (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Vector &Value,
      const Vector *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_scale (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Vector &Value,
      const Vector *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_vector (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Vector &Value,
      const Vector *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_scalar (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Float64 Value,
      const Float64 *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_text (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const String &Value,
      const String *PreviousValue) {

}


void
dmz::MitesPluginHaul::update_object_data (
      const UUID &Identity,
      const Handle ObjectHandle,
      const Handle AttributeHandle,
      const Data &Value,
      const Data *PreviousValue) {

}


void
dmz::MitesPluginHaul::_init (Config &local) {

}


extern "C" {

DMZ_PLUGIN_FACTORY_LINK_SYMBOL dmz::Plugin *
create_dmzMitesPluginHaul (
      const dmz::PluginInfo &Info,
      dmz::Config &local,
      dmz::Config &global) {

   return new dmz::MitesPluginHaul (Info, local);
}

};
